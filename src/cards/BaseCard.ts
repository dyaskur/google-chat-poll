import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';

interface Card {
  buildHeader?(): void;

  buildSections(): void;

  buildButtons?(): void;

  buildFooter?(): void;

  build(): chatV1.Schema$CardWithId;
}

export abstract class BaseCard implements Card {
  private id: string = 'cardId';
  private _header: chatV1.Schema$CardHeader = {};
  private _content: chatV1.Schema$GoogleAppsCardV1Section[] = [];
  private _footer: chatV1.Schema$GoogleAppsCardV1CardFixedFooter = {};

  protected card = {
    'header': this._header,
    'sections': this._content,
    'fixedFooter': this._footer,
  };

  abstract buildSections(): void;

  build(): chatV1.Schema$CardWithId {
    return {
      'cardId': this.id,
      'card': this.card,
    };
  }
  buildMessage(): chatV1.Schema$Message {
    return {cardsV2: [this.build()]};
  }
}
