import { describe, expect, it, vi } from 'vitest';

import { Maybe } from '../utils/types';

import { AbstractViewModel } from './abstract-view-model';
import { ViewModel } from './view-model';

const createTestViewModel = ({
  id = '1',
  payload = {},
}: {
  id?: string;
  payload?: any;
} = {}) => {
  class ViewModelImpl extends AbstractViewModel<any> {
    spies = {
      mount: vi.fn(),
      unmount: vi.fn(),
      payloadChanged: vi.fn(),
      didMount: vi.fn(),
      didUnmount: vi.fn(),
    };

    protected getParentViewModel(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      parentViewModelId: Maybe<string>,
    ): ViewModel<any, ViewModel<any, any>> | null {
      throw new Error('Method not implemented.');
    }

    didMount(): void {
      this.spies.didMount();
    }

    mount(): void {
      super.mount();
      this.spies.mount();
    }

    unmount(): void {
      super.unmount();
      this.spies.unmount();
    }

    payloadChanged(payload: any): void {
      this.spies.payloadChanged(payload);
    }

    didUnmount(): void {
      this.spies.didUnmount();
    }
  }

  const vm = new ViewModelImpl({ id, payload });

  return vm;
};

describe('AbstractViewModel', () => {
  it('create instance', () => {
    const vm = createTestViewModel();
    expect(vm).toBeDefined();
  });

  it('has id', () => {
    const vm = createTestViewModel({ id: '1' });
    expect(vm.id).toBe('1');
  });

  it('has payload', () => {
    const vm = createTestViewModel({ payload: { test: 1 } });
    expect(vm.payload).toEqual({ test: 1 });
  });

  it('has isMounted', () => {
    const vm = createTestViewModel();
    expect(vm.isMounted).toBe(false);
  });

  it('has mount method', () => {
    const vm = createTestViewModel();
    expect(vm.mount).toBeDefined();
  });

  it('has unmount method', () => {
    const vm = createTestViewModel();
    expect(vm.unmount).toBeDefined();
  });

  it('has dispose', () => {
    const vm = createTestViewModel();
    expect(vm.dispose).toBeDefined();
  });

  it('mount should be called once', () => {
    const vm = createTestViewModel();

    vm.mount();

    expect(vm.spies.mount).toHaveBeenCalledOnce();
  });

  it('didMount should be called after mount', () => {
    const vm = createTestViewModel();

    vm.mount();

    expect(vm.spies.didMount).toHaveBeenCalledOnce();
  });

  it('isMounted should be true after mount', () => {
    const vm = createTestViewModel();
    vm.mount();
    expect(vm.isMounted).toBe(true);
  });

  it('unmount should be called once', () => {
    const vm = createTestViewModel();

    vm.unmount();

    expect(vm.spies.unmount).toHaveBeenCalledOnce();
  });

  it('didUnmount should be called after unmount', () => {
    const vm = createTestViewModel();

    vm.unmount();

    expect(vm.spies.didUnmount).toHaveBeenCalledOnce();
  });

  it('isMounted should be false after unmount', () => {
    const vm = createTestViewModel();
    vm.mount();
    vm.unmount();
    expect(vm.isMounted).toBe(false);
  });
});
