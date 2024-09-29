import { Disposable } from 'disposer-util';

import { Class, Maybe } from '../utils/types';

import { ViewModel } from './view-model';
import {
  ViewModelCreateConfig,
  ViewModelGenerateIdConfig,
} from './view-model.store.types';

export interface ViewModelStore extends Disposable {
  getId<T extends ViewModel<any>>(
    idOrClass: Maybe<ViewModel['id'] | Class<T>>,
  ): string | null;

  /**
   * Общее количество монтированных вьюшек
   */
  mountedViewsCount: number;

  /**
   * Проверить наличие инстанса вью модели
   */
  has<T extends ViewModel<any>>(
    idOrClass: Maybe<ViewModel['id'] | Class<T>>,
  ): boolean;

  /**
   * Получить инстанс вью модели
   */
  get<T extends ViewModel<any>>(
    idOrClass: Maybe<ViewModel['id'] | Class<T>>,
  ): T | null;

  /**
   * Привязать модель
   */
  attach(model: ViewModel): Promise<void>;

  /**
   * Отвязать модель
   */
  detach(id: ViewModel['id']): Promise<void>;

  /**
   * Можно ли отрисовать вью модели
   */
  isAbleToRenderView(id: Maybe<ViewModel['id']>): boolean;

  createViewModel<VM extends ViewModel<any>>(
    config: ViewModelCreateConfig<VM>,
  ): VM;

  generateViewModelId<VM extends ViewModel<any>>(
    config: ViewModelGenerateIdConfig<VM>,
  ): string;
}
