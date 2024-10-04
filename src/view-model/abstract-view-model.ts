import { Disposer, IDisposer } from 'disposer-util';
import { isEqual } from 'lodash-es';
import { action, makeObservable, observable } from 'mobx';

import { AnyObject, EmptyObject, Maybe } from '../utils/types';

import { AbstractViewModelParams } from './abstract-view-model.types';
import { ViewModel } from './view-model';

export abstract class AbstractViewModel<
  Payload extends AnyObject = EmptyObject,
  ParentViewModel extends ViewModel<any> = ViewModel<any>,
> implements ViewModel<Payload>
{
  protected disposer: IDisposer = new Disposer();

  id: string;

  isMounted = false;

  public payload: Payload;

  constructor(private params: AbstractViewModelParams<Payload>) {
    this.id = params.id;
    this.payload = params.payload;

    makeObservable(this, {
      isMounted: observable.ref,
      payload: observable.ref,
      mount: action,
      didMount: action,
      unmount: action,
      didUnmount: action,
      setPayload: action,
    });
  }

  mount() {}

  didMount() {}

  unmount() {}

  didUnmount() {
    this.dispose();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  payloadChanged(payload: Payload) {}

  get parentViewModel() {
    return this.getParentViewModel(this.params.parentViewModelId);
  }

  setPayload(payload: Payload) {
    if (!isEqual(this.payload, payload)) {
      this.payload = payload;
      this.payloadChanged(payload);
    }
  }

  protected abstract getParentViewModel(
    parentViewModelId: Maybe<string>,
  ): ParentViewModel | null;

  dispose() {
    this.disposer.dispose();
  }
}
