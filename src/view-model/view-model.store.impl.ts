import { AbstractViewModelStore } from './abstract-view-model.store';
import { ViewModelCreateConfig } from './view-model.store.types';
import { AnyViewModel } from './view-model.types';

export class ViewModelStoreImpl extends AbstractViewModelStore {
  createViewModel<VM extends AnyViewModel>(
    config: ViewModelCreateConfig<VM>,
  ): VM {
    const VM = config.VM;

    if (config.component) {
      this.linkComponent(config.component, VM);
    }

    if (config.ctx?.externalComponent) {
      this.linkComponent(config.component, VM);
    }

    return new VM(config);
  }
}
