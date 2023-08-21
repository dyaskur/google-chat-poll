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
export interface PollConfig {
  topic: string,
  choices: string[],
  anon?: boolean,
  optionable?: boolean,
  closable?: boolean,
}
export interface PollState extends PollConfig{
  choiceCreator?: ChoiceCreator,
  author?: chatV1.Schema$User,
  votes?: Votes,
}
