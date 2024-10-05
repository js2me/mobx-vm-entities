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
      mount: action,
      didMount: action,
      unmount: action,
      didUnmount: action,
      setPayload: action,
    });
  }

  /**
   * Метод вызывается когда вюшка начала примонтироваться
   */
  mount() {
    /* Пустой метод, чтобы его переопределить */
  }

  /**
   * Метод вызывается когда вьюшка была примонтирована
   */
  didMount() {
    /* Пустой метод, чтобы его переопределить */
  }

  /**
   * Метод вызывается когда вюшка запустила процесс размонтирования
   */
  unmount() {
    /* Пустой метод, чтобы его переопределить */
  }

  /**
   * Метод вызывается когда вюшка была размонтирована
   */
  didUnmount() {
    this.dispose();
  }

  /**
   * Метод вызывается когда пейлоад вью модели был изменён
   *
   * Состояние - "был изменён" определяется внутри setPayload метода
   */
  payloadChanged(payload: Payload) {
    /* Пустой метод, чтобы его переопределить */
  }

  /**
   * Возвращает родительскую вью модель
   * Для работы этого поля необходим getParentViewModel метод
   */
  get parentViewModel() {
    return this.getParentViewModel(this.params.parentViewModelId);
  }

  /**
   * Метод вызывается когда пейлоад меняется(ссылочно за счет useLayoutEffect) в реакте компоненте
   */
  setPayload(payload: Payload) {
    if (!isEqual(this.payload, payload)) {
      this.payload = payload;
      this.payloadChanged(payload);
    }
  }

  /**
   * Метод получения родительской вью модели
   */
  protected abstract getParentViewModel(
    parentViewModelId: Maybe<string>,
  ): ParentViewModel | null;

  dispose() {
    this.disposer.dispose();
  }
}
