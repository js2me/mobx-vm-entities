import { describe, expect, it, vi } from 'vitest';

import { AnyObject, EmptyObject, Maybe } from '../utils/types';

import { AbstractViewModelStore } from './abstract-view-model.store';
import { TestAbstractViewModelImpl } from './abstract-view-model.test';
import { AbstractViewModelParams } from './abstract-view-model.types';
import { ViewModel } from './view-model';
import { TestViewModelImpl } from './view-model.impl.test';
import { ViewModelStore } from './view-model.store';
import {
  ViewModelCreateConfig,
  ViewModelGenerateIdConfig,
} from './view-model.store.types';
import { AnyViewModel } from './view-model.types';

export class TestViewModelStoreImpl extends AbstractViewModelStore {
  spies = {
    generateViewModelId: vi.fn(),
  };

  createViewModel<VM extends ViewModel>(config: ViewModelCreateConfig<VM>): VM {
    const VM = config.VM;
    return new VM(config);
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
    const vm = new TestAbstractViewModelImpl({ id: '1' });
    await vmStore.attach(vm);
    expect(vmStore.get('1')).toBe(vm);
    expect(vmStore.instanceAttachedCount.get('1')).toBe(1);
  });

  it('is able to detach view model', async () => {
    const vmStore = new TestViewModelStoreImpl();
    const vm = new TestAbstractViewModelImpl({ id: '1' });
    await vmStore.attach(vm);
    await vmStore.detach('1');
    expect(vmStore.get('1')).toBe(null);
    expect(vmStore.instanceAttachedCount.get('1')).toBe(undefined);
  });

  it('accessing to parent view models using store [using parentViewModelId and vmStore]', async () => {
    class TestViewModelImpl1<
      Payload extends AnyObject = EmptyObject,
      ParentViewModel extends AnyViewModel | null = null,
    > extends TestAbstractViewModelImpl<Payload, ParentViewModel> {
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

  it('able to get access to view model by id', async () => {
    const vmStore = new TestViewModelStoreImpl();

    const vm = new TestViewModelImpl();

    await vmStore.attach(vm);

    expect(vmStore.get(vm.id)).toBe(vm);
  });

  it('able to get access to view model by Class', async () => {
    const vmStore = new TestViewModelStoreImpl();

    class MyVM extends TestViewModelImpl {}
    const vm = new MyVM();

    await vmStore.attach(vm);

    expect(vmStore.get(MyVM)).toBe(vm);
  });

  it('able to get instance id by id (getId method)', async () => {
    const vmStore = new TestViewModelStoreImpl();

    class MyVM extends TestViewModelImpl {}
    const vm = new MyVM();

    await vmStore.attach(vm);

    expect(vmStore.getId(vm.id)).toBe(vm.id);
  });

  it('able to get instance id by Class (getId method)', async () => {
    const vmStore = new TestViewModelStoreImpl();

    class MyVM extends TestViewModelImpl {}
    const vm = new MyVM();

    await vmStore.attach(vm);

    expect(vmStore.getId(MyVM)).toBe(vm.id);
  });
});
