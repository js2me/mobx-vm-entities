import { describe, expect, it, vi } from 'vitest';

import { AnyObject, EmptyObject, Maybe } from '../utils/types';

import { AbstractViewModelStore } from './abstract-view-model.store';
import { TestViewModelImpl } from './abstract-view-model.test';
import { AbstractViewModelParams } from './abstract-view-model.types';
import { ViewModel } from './view-model';
import { ViewModelStore } from './view-model.store';
import {
  ViewModelCreateConfig,
  ViewModelGenerateIdConfig,
} from './view-model.store.types';

export class TestViewModelStoreImpl extends AbstractViewModelStore {
  spies = {
    generateViewModelId: vi.fn(),
  };

  createViewModel<VM extends ViewModel>(config: ViewModelCreateConfig<VM>): VM {
    const VM = config.VM;

    const params: AbstractViewModelParams<VM['payload']> = {
      id: config.id,
      payload: config.payload,
      parentViewModelId: config.parentViewModelId,
    };

    return new VM(params);
  }

  generateViewModelId<VM extends ViewModel>(
    config: ViewModelGenerateIdConfig<VM>,
  ): string {
    const result = super.generateViewModelId(config);
    this.spies.generateViewModelId(result, config);
    return result;
  }
}

describe('AbstractViewModelStore', () => {
  it('create instance', () => {
    const vmStore = new TestViewModelStoreImpl();
    expect(vmStore).toBeDefined();
  });

  it('is able to attach view model', async () => {
    const vmStore = new TestViewModelStoreImpl();
    const vm = new TestViewModelImpl({ id: '1' });
    await vmStore.attach(vm);
    expect(vmStore.get('1')).toBe(vm);
    expect(vmStore.instanceAttachedCount.get('1')).toBe(1);
  });

  it('is able to detach view model', async () => {
    const vmStore = new TestViewModelStoreImpl();
    const vm = new TestViewModelImpl({ id: '1' });
    await vmStore.attach(vm);
    await vmStore.detach('1');
    expect(vmStore.get('1')).toBe(null);
    expect(vmStore.instanceAttachedCount.get('1')).toBe(undefined);
  });

  it('accessing to parent view models using store', async () => {
    class TestViewModelImpl1<
      Payload extends AnyObject = EmptyObject,
      ParentViewModel extends ViewModel<any> | null = null,
    > extends TestViewModelImpl<Payload, ParentViewModel> {
      constructor(
        private vmStore: ViewModelStore,
        params?: Partial<AbstractViewModelParams<Payload>>,
      ) {
        super(params);
      }

      protected getParentViewModel(
        parentViewModelId: Maybe<string>,
      ): ParentViewModel {
        return this.vmStore.get(parentViewModelId)! as ParentViewModel;
      }
    }

    class VMParent extends TestViewModelImpl1 {}
    class VMChild extends TestViewModelImpl1<any, VMParent> {}

    const vmStore = new TestViewModelStoreImpl();

    const parentVM = new VMParent(vmStore, { id: 'parent' });

    await vmStore.attach(parentVM);

    const childVM = new VMChild(vmStore, {
      id: 'child',
      parentViewModelId: 'parent',
    });

    await vmStore.attach(parentVM);

    expect(childVM.parentViewModel.id).toBe('parent');
  });
});
