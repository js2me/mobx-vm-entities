import { AnyObject, EmptyObject, Maybe } from '../utils/types';

import { AnyViewModel } from './view-model.types';

export interface AbstractViewModelParams<
  Payload extends AnyObject = EmptyObject,
  ParentViewModel extends AnyViewModel | null = null,
> {
  id: string;
  payload: Payload;
  parentViewModelId?: Maybe<string>;
  parentViewModel?: Maybe<ParentViewModel>;
  ctx?: AnyObject;
}
