import { AnyObject, EmptyObject, Maybe } from '../utils/types';

import { ViewModelStore } from './view-model.store';
import { AnyViewModel } from './view-model.types';

export interface AbstractViewModelParams<
  Payload extends AnyObject = EmptyObject,
  ParentViewModel extends AnyViewModel | null = null,
> {
  id: string;
  payload: Payload;
  viewModels?: Maybe<ViewModelStore>;
  parentViewModelId?: Maybe<string>;
  parentViewModel?: Maybe<ParentViewModel>;
  ctx?: AnyObject;
}
