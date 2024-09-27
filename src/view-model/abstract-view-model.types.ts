import { AnyObject, EmptyObject, Maybe } from '../utils/types';

export interface AbstractViewModelParams<
  Payload extends AnyObject = EmptyObject,
> {
  id: string;
  payload: Payload;
  parentViewModelId?: Maybe<string>;
  ctx?: AnyObject;
}
