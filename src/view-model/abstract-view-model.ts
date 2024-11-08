/* eslint-disable @typescript-eslint/no-unused-vars */
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
      mount: action.bound,
      didMount: action,
      unmount: action.bound,
      didUnmount: action,
      setPayload: action,
    });
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
    this.dispose();
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
  ): ParentViewModel | null;

  dispose() {
    this.disposer.dispose();
  }
}
