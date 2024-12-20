import { describe, expect, it, vi } from 'vitest';

import { AnyObject, EmptyObject, Maybe } from '../utils/types';

import { AbstractViewModelParams } from './abstract-view-model.types';
import { ViewModel } from './view-model';
import { ViewModelMock } from './view-model.impl.test';
import { ViewModelStore } from './view-model.store';
import { ViewModelGenerateIdConfig } from './view-model.store.types';
import { AnyViewModel } from './view-model.types';

import { ViewModelStoreImpl } from '.';

export class ViewModelStoreMock extends ViewModelStoreImpl {
  spies = {
    generateViewModelId: vi.fn(),
  };

  get _instanceAttachedCount() {
    return this.instanceAttachedCount;
  }

  generateViewModelId<VM extends ViewModel>(
    config: ViewModelGenerateIdConfig<VM>,
  ): string {
    const result = super.generateViewModelId(config);
    this.spies.generateViewModelId(result, config);
    return result;
  }
}

describe('ViewModelStoreImpl', () => {
  it('has clean method', () => {
    const vmStore = new ViewModelStoreMock();
    expect(vmStore.clean).toBeDefined();
  });
  it('has dispose method', () => {
    const vmStore = new ViewModelStoreMock();
    expect(vmStore.dispose).toBeDefined();
  });
  it('has attach method', () => {
    const vmStore = new ViewModelStoreMock();
    expect(vmStore.attach).toBeDefined();
  });
  it('has createViewModel method', () => {
    const vmStore = new ViewModelStoreMock();
    expect(vmStore.createViewModel).toBeDefined();
  });

  it('create instance', () => {
    const vmStore = new ViewModelStoreMock();
    expect(vmStore).toBeDefined();
  });

  it('is able to attach view model', async () => {
    const vmStore = new ViewModelStoreMock();
    const vm = new ViewModelMock({ id: '1' });
    await vmStore.attach(vm);
    expect(vmStore.get('1')).toBe(vm);
    expect(vmStore._instanceAttachedCount.get('1')).toBe(1);
  });

  it('is able to detach view model', async () => {
    const vmStore = new ViewModelStoreMock();
    const vm = new ViewModelMock({ id: '1' });
    await vmStore.attach(vm);
    await vmStore.detach('1');
    expect(vmStore.get('1')).toBe(null);
    expect(vmStore._instanceAttachedCount.get('1')).toBe(undefined);
  });

  it('is able to get total mounted views count', async () => {
    const vmStore = new ViewModelStoreMock();
    await vmStore.attach(new ViewModelMock({ id: '1' }));
    await vmStore.attach(new ViewModelMock({ id: '1' }));
    await vmStore.attach(new ViewModelMock({ id: '2' }));
    await vmStore.attach(new ViewModelMock({ id: '2' }));
    await vmStore.attach(new ViewModelMock({ id: '3' }));
    await vmStore.attach(new ViewModelMock({ id: '3' }));
    expect(vmStore.mountedViewsCount).toBe(6);
  });

  it('accessing to parent view models using store [using parentViewModelId and vmStore]', async () => {
    class TestViewModelImpl1<
      Payload extends AnyObject = EmptyObject,
      ParentViewModel extends AnyViewModel | null = null,
    > extends ViewModelMock<Payload, ParentViewModel> {
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

    const vmStore = new ViewModelStoreMock();

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
    const vmStore = new ViewModelStoreMock();

    const vm = new ViewModelMock();

    await vmStore.attach(vm);

    expect(vmStore.get(vm.id)).toBe(vm);
  });

  it('able to get access to view model by Class', async () => {
    const vmStore = new ViewModelStoreMock();

    class MyVM extends ViewModelMock {}
    const vm = new MyVM();

    await vmStore.attach(vm);

    expect(vmStore.get(MyVM)).toBe(vm);
  });

  it('able to get instance id by id (getId method)', async () => {
    const vmStore = new ViewModelStoreMock();

    class MyVM extends ViewModelMock {}
    const vm = new MyVM();

    await vmStore.attach(vm);

    expect(vmStore.getId(vm.id)).toBe(vm.id);
  });

  it('able to get instance id by Class (getId method)', async () => {
    const vmStore = new ViewModelStoreMock();

    class MyVM extends ViewModelMock {}
    const vm = new MyVM();

    await vmStore.attach(vm);

    expect(vmStore.getId(MyVM)).toBe(vm.id);
  });
});