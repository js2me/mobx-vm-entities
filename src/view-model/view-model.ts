import { Disposable } from 'mobx-disposer-util';

import type { AbstractViewModelImpl } from './abstract-view-model.impl';

export interface ViewModel<
  Payload extends AnyObject = EmptyObject,
  ParentViewModel extends ViewModel<any> = ViewModel<any, any>,
> extends Disposable {
  id: string;

  payload: Payload;

  isMounted: boolean;

  parentViewModel: ParentViewModel | null;

  mount(): void | Promise<void>;

  didMount(): void;

  didUnmount(): void;

  unmount(): void | Promise<void>;

  setPayload(payload: Payload): void;

  payloadChanged(payload: Payload): void;
}

export type ViewModelClass<T extends ViewModel<any> = ViewModel<any>> = Class<
  T,
  ConstructorParameters<typeof AbstractViewModelImpl<T['payload']>>
>;
