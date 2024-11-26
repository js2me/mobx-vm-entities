/* eslint-disable @typescript-eslint/no-unused-vars */

import { AnyObject, EmptyObject } from '../utils/types';

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
  protected getParentViewModel(): ParentViewModel {
    return this.params.parentViewModel!;
  }
}
