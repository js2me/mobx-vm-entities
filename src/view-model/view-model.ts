import { Disposable } from 'disposer-util';

import { AnyObject, Class, EmptyObject } from '../utils/types';

import type { AbstractViewModel } from './abstract-view-model';

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
  ConstructorParameters<typeof AbstractViewModel<T['payload']>>
>;
