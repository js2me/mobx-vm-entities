/* eslint-disable @typescript-eslint/no-unused-vars */
import { Disposer, IDisposer } from 'disposer-util';
import { isEqual } from 'lodash-es';
import { action, makeObservable, observable } from 'mobx';

import { AnyObject, EmptyObject, Maybe } from '../utils/types';

import { AbstractViewModelParams } from './abstract-view-model.types';
import { ViewModel } from './view-model';
import { ViewModelStore } from './view-model.store';
import { AnyViewModel } from './view-model.types';

declare const process: { env: { NODE_ENV?: string } };

export abstract class AbstractViewModel<
  Payload extends AnyObject = EmptyObject,
  ParentViewModel extends AnyViewModel | null = null,
> implements ViewModel<Payload, ParentViewModel>
{
  private abortController: AbortController;

  public unmountSignal: AbortSignal;
  /**
   * @deprecated use {unmountSignal} instead
   */
  protected disposer: IDisposer = new Disposer();

  id: string;

  isMounted = false;

  public payload: Payload;

  constructor(
    protected params: AbstractViewModelParams<Payload, ParentViewModel>,
  ) {
    this.id = params.id;
    this.payload = params.payload;
    this.abortController = new AbortController();
    this.unmountSignal = this.abortController.signal;

    this.unmountSignal.addEventListener('abort', () => {
      // eslint-disable-next-line sonarjs/deprecation
      this.disposer.dispose();
    });

    observable.ref(this, 'isMounted');
    observable.ref(this, 'payload');
    action.bound(this, 'mount');
    action(this, 'didMount');
    action.bound(this, 'unmount');
    action(this, 'didUnmount');
    action(this, 'setPayload');

    makeObservable(this);
  }

  protected get viewModels(): ViewModelStore {
    if (process.env.NODE_ENV !== 'production' && !this.params.viewModels) {
      console.warn(
        'accessing to viewModels is not possible. [viewModels] param is not setted during to creating instance AbstractViewModel',
      );
    }

    return this.params.viewModels!;
  }

  /**
   * The method is called when the view starts mounting
   */
  mount() {
    this.isMounted = true;

    this.didMount();
  }

  /**
   * The method is called when the view was mounted
   */
  didMount() {
    /* Empty method to be overridden */
  }

  /**
   * The method is called when the view starts unmounting
   */
  unmount() {
    this.isMounted = false;

    this.didUnmount();
  }

  /**
   * The method is called when the view was unmounted
   */
  didUnmount() {
    this.abortController.abort();
  }

  /**
   * The method is called when the payload of the view model was changed
   *
   * The state - "was changed" is determined inside the setPayload method
   */
  payloadChanged(payload: Payload) {
    /* Empty method to be overridden */
  }

  /**
   * Returns the parent view model
   * For this property to work, the getParentViewModel method is required
   */
  get parentViewModel() {
    return this.getParentViewModel(this.params.parentViewModelId);
  }

  /**
   * The method is called when the payload changes (referentially due to useLayoutEffect) in the react component
   */
  setPayload(payload: Payload) {
    if (!isEqual(this.payload, payload)) {
      this.payload = payload;
      this.payloadChanged(payload);
    }
  }

  /**
   * The method of getting the parent view model
   */
  protected abstract getParentViewModel(
    parentViewModelId: Maybe<string>,
  ): ParentViewModel;

  /**
   * @deprecated use {didUnmount} instead
   */
  dispose() {
    this.abortController.abort();
  }
}
