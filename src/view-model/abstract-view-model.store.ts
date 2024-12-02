import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';

import { generateVMId } from '../utils';
import { Class, Maybe } from '../utils/types';

import { ViewModelStore } from './view-model.store';
import {
  ViewModelCreateConfig,
  ViewModelGenerateIdConfig,
} from './view-model.store.types';
import { AnyViewModel } from './view-model.types';

export abstract class AbstractViewModelStore<
  VMBase extends AnyViewModel = AnyViewModel,
> implements ViewModelStore<VMBase>
{
  viewModels = observable.map<string, VMBase>();
  viewModelsByClasses = observable.map<string, string[]>();

  instanceAttachedCount = new Map<string, number>();

  /**
   * Views waiting for mount
   */
  mountingViews = observable.set<string>();

  /**
   * Views waiting for unmount
   */
  unmountingViews = observable.set<string>();

  constructor() {
    makeObservable(this, {
      mountedViewsCount: computed,
      mount: action,
      unmount: action,
      attach: action,
      detach: action,
    });
  }

  get mountedViewsCount() {
    return [...this.instanceAttachedCount.values()].reduce(
      (sum, count) => sum + count,
      0,
    );
  }

  abstract createViewModel<VM extends VMBase>(
    config: ViewModelCreateConfig<VM>,
  ): VM;

  generateViewModelId<VM extends VMBase>(
    config: ViewModelGenerateIdConfig<VM>,
  ): string {
    if (config.id) {
      return config.id;
    } else {
      return generateVMId(config.ctx);
    }
  }

  getId<T extends VMBase>(idOrClass: Maybe<string | Class<T>>): string | null {
    if (!idOrClass) return null;

    if (typeof idOrClass === 'string') {
      return idOrClass;
    }

    const className = idOrClass.name;
    const viewModels = this.viewModelsByClasses.get(className) || [];

    if (process.env.NODE_ENV !== 'production' && viewModels.length > 1) {
      console.warn(
        `Found more than 1 view model with the same identifier "${className}". Last instance will been returned`,
      );
    }

    return viewModels.at(-1)!;
  }

  has<T extends VMBase>(idOrClass: Maybe<string | Class<T>>): boolean {
    const id = this.getId(idOrClass);

    if (!id) return false;

    return this.viewModels.has(id);
  }

  get<T extends VMBase>(idOrClass: Maybe<string | Class<T>>): T | null {
    const id = this.getId(idOrClass);

    if (!id) return null;

    return (this.viewModels.get(id) as Maybe<T>) ?? null;
  }

  async mount(model: VMBase) {
    this.mountingViews.add(model.id);

    await model.mount();

    runInAction(() => {
      this.mountingViews.delete(model.id);
    });
  }

  async unmount(model: VMBase) {
    this.unmountingViews.add(model.id);

    await model.unmount();

    runInAction(() => {
      this.unmountingViews.delete(model.id);
    });
  }

  async attach(model: VMBase) {
    const attachedCount = this.instanceAttachedCount.get(model.id) ?? 0;

    this.instanceAttachedCount.set(model.id, attachedCount + 1);

    if (this.viewModels.has(model.id)) {
      return;
    }

    this.viewModels.set(model.id, model);
    const constructor = (model as any).constructor;

    if (this.viewModelsByClasses.has(constructor.name)) {
      this.viewModelsByClasses.get(constructor.name)!.push(model.id);
    } else {
      this.viewModelsByClasses.set(constructor.name, [model.id]);
    }

    await this.mount(model);
  }

  async detach(id: string) {
    const attachedCount = this.instanceAttachedCount.get(id) ?? 0;

    const model = this.viewModels.get(id);

    if (model) {
      this.instanceAttachedCount.set(model.id, attachedCount - 1);

      if (attachedCount - 1 <= 0) {
        this.instanceAttachedCount.delete(model.id);

        const constructor = (model as any).constructor;

        await this.unmount(model);

        runInAction(() => {
          this.viewModels.delete(id);

          if (this.viewModelsByClasses.has(constructor.name)) {
            this.viewModelsByClasses.set(
              constructor.name,
              this.viewModelsByClasses
                .get(constructor.name)!
                .filter((id) => id !== model.id),
            );
          }
        });
      }
    }
  }

  isAbleToRenderView(id: Maybe<string>): boolean {
    return !!id && this.viewModels.has(id) && !this.mountingViews.has(id);
  }

  dispose(): void {
    this.viewModels.clear();
    this.viewModelsByClasses.clear();
    this.instanceAttachedCount.clear();
    this.mountingViews.clear();
    this.unmountingViews.clear();
  }
}
