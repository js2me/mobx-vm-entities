/* eslint-disable @typescript-eslint/no-unused-vars */

import { AnyObject, EmptyObject, Maybe } from '../utils/types';

import { AbstractViewModel } from './abstract-view-model';
import { ViewModel } from './view-model';
import { AnyViewModel } from './view-model.types';

export class ViewModelImpl<
    Payload extends AnyObject = EmptyObject,
    ParentViewModel extends AnyViewModel | null = null,
  >
  extends AbstractViewModel<Payload, ParentViewModel>
  implements ViewModel<Payload, ParentViewModel>
{
  protected getParentViewModel(
    parentViewModelId: Maybe<string>,
  ): ParentViewModel {
    return (
      this.params.parentViewModel ??
      (this.viewModels?.get(parentViewModelId) as unknown as ParentViewModel)
    );
  }
}
