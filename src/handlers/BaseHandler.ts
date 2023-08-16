import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';

export abstract class BaseHandler {
  protected event: chatV1.Schema$DeprecatedEvent;

  protected constructor(event: chatV1.Schema$DeprecatedEvent) {
    this.event = event;
  }

  protected getAnnotations(): chatV1.Schema$Annotation[] {
    return this.event?.message?.annotations ?? [];
  }

  public abstract process(): chatV1.Schema$Message;
}
