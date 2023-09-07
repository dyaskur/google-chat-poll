import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';
import {LocaleTimezone} from '../helpers/interfaces';
import {DEFAULT_LOCALE_TIMEZONE} from '../helpers/time';

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

  protected getUserTimezone(): LocaleTimezone {
    if (this.event.common?.timeZone?.id) {
      const locale = this.event.common.userLocale;
      const id = this.event.common.timeZone.id;
      const offset = this.event.common.timeZone.offset ?? 0;
      return {locale, id, offset};
    }

    return DEFAULT_LOCALE_TIMEZONE;
  }

  public abstract process(): chatV1.Schema$Message | Promise<chatV1.Schema$Message>;
}
