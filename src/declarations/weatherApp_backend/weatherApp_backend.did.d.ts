import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type List = [] | [[string, List]];
export interface _SERVICE {
  'deleteHistory' : ActorMethod<[], List>,
  'fetchList' : ActorMethod<[], List>,
  'isAlreadySearch' : ActorMethod<[string], boolean>,
  'put' : ActorMethod<[string], string>,
}
