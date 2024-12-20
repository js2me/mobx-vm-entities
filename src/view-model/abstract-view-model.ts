/* eslint-disable @typescript-eslint/no-unused-vars */

import { AnyObject, EmptyObject } from '../utils/types';

import { AbstractViewModelParams } from './abstract-view-model.types';
import { ViewModelImpl } from './view-model.impl';
import { AnyViewModel } from './view-model.types';

declare const process: { env: { NODE_ENV?: string } };

/**
 * @deprecated removed since 5.0.0 version. Please use {@link ViewModelImpl}
 */
export abstract class AbstractViewModel<
  Payload extends AnyObject = EmptyObject,
  ParentViewModel extends AnyViewModel | null = null,
> extends ViewModelImpl<Payload, ParentViewModel> {
  constructor(
    protected params: AbstractViewModelParams<Payload, ParentViewModel>,
  ) {
    super(params);
  }
}
