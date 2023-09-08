import {CloudTasksClient} from '@google-cloud/tasks';
import {google} from '@google-cloud/tasks/build/protos/protos';
import {PollForm, TaskEvent} from './interfaces';

const client = new CloudTasksClient();

export async function createTask(payload: string, scheduleInSeconds: number) {
  const project = process.env.GCP_PROJECT;
  const queue = process.env.QUEUE_NAME;
  const location = process.env.FUNCTION_REGION;
  if (!project || !queue || !location) {
    throw new Error('Missing required environment variables');
  }
  const url = `https://${location}-${project}.cloudfunctions.net/app`;
  // Construct the fully qualified queue name.
  const parent = client.queuePath(project, location, queue);

  const task: google.cloud.tasks.v2.ITask = {
    httpRequest: {
      headers: {
        'Content-Type': 'application/json', // Set content type to ensure compatibility your application's request parsing
      }, httpMethod: 'POST', url,
    },
  };

  task.httpRequest!.body = Buffer.from(payload).toString('base64');

  // The time when the task is scheduled to be attempted.
  task.scheduleTime = {
    seconds: scheduleInSeconds / 1000,
  };

  const request: google.cloud.tasks.v2.ICreateTaskRequest = {parent: parent, task: task};
  const [response] = await client.createTask(request);
  console.log(`Created task ${response.name}`);
  return response;
}

export async function createAutoCloseTask(config: PollForm, messageId: string) {
  if (config.autoClose && config.closedTime) {
    const taskPayload: TaskEvent = {'id': messageId, 'action': 'close_poll', 'type': 'TASK'};
    await createTask(JSON.stringify(taskPayload), config.closedTime);
    if (config.autoMention) {
      const taskPayload: TaskEvent = {'id': messageId, 'action': 'remind_all', 'type': 'TASK'};
      await createTask(JSON.stringify(taskPayload), config.closedTime - 420000);
    }
  }
}
