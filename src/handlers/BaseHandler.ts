import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';

export default abstract class BaseHandler {
  protected event: chatV1.Schema$DeprecatedEvent;

  constructor(event: chatV1.Schema$DeprecatedEvent) {
    this.event = event;
  }

  protected getAnnotations(): chatV1.Schema$Annotation[] {
    return this.event.message?.annotations ?? [];
  }

  protected getAnnotationByType(type: string): chatV1.Schema$Annotation | undefined {
    return this.getAnnotations().find((annotation) => annotation.type === type);
  }

  public abstract process(): chatV1.Schema$Message | Promise<chatV1.Schema$Message>;
}
