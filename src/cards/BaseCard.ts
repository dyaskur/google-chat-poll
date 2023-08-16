import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';

interface Card {
  buildHeader?(): void;

  buildSections(): void;

  buildButtons?(): void;

  buildFooter?(): void;

  make(): chatV1.Schema$CardWithId;
}

export abstract class BaseCard implements Card {
  private id: string = 'cardId';
  private _content: chatV1.Schema$GoogleAppsCardV1Section[] = [];

  protected card: chatV1.Schema$GoogleAppsCardV1Card = {
    sections: this._content,
  };

  abstract buildSections(): void;

  make(): chatV1.Schema$CardWithId {
    return {
      'cardId': this.id,
      'card': this.card,
    };
  }

  buildMessage(): chatV1.Schema$Message {
    return {cardsV2: [this.make()]};
  }
}
