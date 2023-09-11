import {chat_v1 as chatV1} from '@googleapis/chat/build/v1';

export function createButtonLink(text: string, url: string): chatV1.Schema$GoogleAppsCardV1Button {
  return {
    text,
    'onClick': {
      'openLink': {
        url,
      },
    },
  };
}

export function createButton(
  text: string, action: string, interaction: string | undefined = undefined): chatV1.Schema$GoogleAppsCardV1Button {
  const button: chatV1.Schema$GoogleAppsCardV1Button = {
    text,
    'onClick': {
      'action': {
        'function': action,
      },
    },
  };
  interaction && (button.onClick!.action!.interaction = interaction);
  return button;
}
