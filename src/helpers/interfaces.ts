import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';

export interface Voter {
  uid: string,
  name?: string
}

// thanks to
// https://stackoverflow.com/questions/12710905/how-do-i-dynamically-assign-properties-to-an-object-in-typescript
interface ChoiceCreator {
  [key: string]: string;
}

export interface Votes {
  [key: string]: Voter[];
}
export enum ClosableType {
  UNCLOSEABLE,
  CLOSEABLE_BY_CREATOR,
  CLOSEABLE_BY_ANYONE,
}
export interface PollConfig {
  anon?: boolean,
  choices: string[],
  optionable?: boolean,
  topic: string,
  type?: ClosableType,
}

export interface PollState extends PollConfig{
  choiceCreator?: ChoiceCreator,
  author?: chatV1.Schema$User,
  votes?: Votes,
  closedTime?: number,
}

export interface MessageDialogConfig {
  title: string,
  message: string,
  imageUrl?: string,
}
