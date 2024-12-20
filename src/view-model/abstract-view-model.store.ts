// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ViewModelStoreImpl } from './view-model.store.impl';
import { AnyViewModel } from './view-model.types';

/**
 * @deprecated removed since 5.0.0 version. Please use {@link ViewModelStoreImpl}
 */
export abstract class AbstractViewModelStore<
  VMBase extends AnyViewModel = AnyViewModel,
> extends ViewModelStoreImpl<VMBase> {}
