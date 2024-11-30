import { AbstractViewModelStore } from './abstract-view-model.store';
import { ViewModelCreateConfig } from './view-model.store.types';
import { AnyViewModel } from './view-model.types';

export class ViewModelStoreImpl extends AbstractViewModelStore {
  createViewModel<VM extends AnyViewModel>(
    config: ViewModelCreateConfig<VM>,
  ): VM {
    const VM = config.VM;
    return new VM(config);
  }
}
