import { AnyObject, EmptyObject } from '../utils/types';

import { AnyViewModel, ViewModelParams } from './view-model.types';

/**
 * @deprecated removed since 5.0.0 version. Please use {@link ViewModelParams}
 */
export interface AbstractViewModelParams<
  Payload extends AnyObject = EmptyObject,
  ParentViewModel extends AnyViewModel | null = null,
> extends ViewModelParams<Payload, ParentViewModel> {}
