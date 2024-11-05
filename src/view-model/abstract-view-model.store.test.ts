import { describe, expect, it, vi } from 'vitest';

import { AbstractViewModelStore } from './abstract-view-model.store';
import { TestViewModelImpl } from './abstract-view-model.test';
import { AbstractViewModelParams } from './abstract-view-model.types';
import {
  ViewModelCreateConfig,
  ViewModelGenerateIdConfig,
} from './view-model.store.types';

export class TestViewModelStoreImpl extends AbstractViewModelStore<TestViewModelImpl> {
  spies = {
    generateViewModelId: vi.fn(),
  };

  createViewModel<VM extends TestViewModelImpl>(
    config: ViewModelCreateConfig<VM>,
  ): VM {
    const VM = config.VM;

    const params: AbstractViewModelParams<VM['payload']> = {
      id: config.id,
      payload: config.payload,
      parentViewModelId: config.parentViewModelId,
    };

    return new VM(params);
  }

  generateViewModelId<VM extends TestViewModelImpl>(
    config: ViewModelGenerateIdConfig<VM>,
  ): string {
    const result = super.generateViewModelId(config);
    this.spies.generateViewModelId(result, config);
    return result;
  }
}

const createTestViewModelStore = () => {
  return new TestViewModelStoreImpl();
};

describe('AbstractViewModelStore', () => {
  it('create instance', () => {
    const vmStore = createTestViewModelStore();
    expect(vmStore).toBeDefined();
  });

  it('is able to attach view model', async () => {
    const vmStore = createTestViewModelStore();
    const vm = new TestViewModelImpl({ id: '1', payload: '1' });
    await vmStore.attach(vm);
    expect(vmStore.get('1')).toBe(vm);
    expect(vmStore.instanceAttachedCount.get('1')).toBe(1);
  });

  it('is able to detach view model', async () => {
    const vmStore = createTestViewModelStore();
    const vm = new TestViewModelImpl({ id: '1', payload: '1' });
    await vmStore.attach(vm);
    await vmStore.detach('1');
    expect(vmStore.get('1')).toBe(null);
    expect(vmStore.instanceAttachedCount.get('1')).toBe(undefined);
  });
});
