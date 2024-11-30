import { describe, expect, it, vi } from 'vitest';

import { AnyObject, EmptyObject } from '../utils/types';

import { AbstractViewModelParams } from './abstract-view-model.types';
import { ViewModelImpl } from './view-model.impl';
import { AnyViewModel } from './view-model.types';
export class TestViewModelImpl<
  Payload extends AnyObject = EmptyObject,
  ParentViewModel extends AnyViewModel | null = null,
> extends ViewModelImpl<Payload, ParentViewModel> {
  spies = {
    mount: vi.fn(),
    unmount: vi.fn(),
    payloadChanged: vi.fn(),
    didMount: vi.fn(),
    didUnmount: vi.fn(),
  };

  constructor(params?: Partial<AbstractViewModelParams<Payload>>) {
    super({
      ...params,
      id: params?.id ?? '1',
      payload: params?.payload ?? ({} as any),
    });
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

describe('ViewModelImpl', () => {
  it('create instance', () => {
    const vm = new TestViewModelImpl();
    expect(vm).toBeDefined();
  });

  it('has id', () => {
    const vm = new TestViewModelImpl();
    expect(vm.id).toBe('1');
  });

  it('has payload', () => {
    const vm = new TestViewModelImpl({ payload: { test: 1 } });
    expect(vm.payload).toEqual({ test: 1 });
  });

  it('has isMounted', () => {
    const vm = new TestViewModelImpl();
    expect(vm.isMounted).toBe(false);
  });

  it('has mount method', () => {
    const vm = new TestViewModelImpl();
    expect(vm.mount).toBeDefined();
  });

  it('has unmount method', () => {
    const vm = new TestViewModelImpl();
    expect(vm.unmount).toBeDefined();
  });

  it('has dispose', () => {
    const vm = new TestViewModelImpl();
    expect(vm.dispose).toBeDefined();
  });

  it('mount should be called once', () => {
    const vm = new TestViewModelImpl();

    vm.mount();

    expect(vm.spies.mount).toHaveBeenCalledOnce();
  });

  it('didMount should be called after mount', () => {
    const vm = new TestViewModelImpl();

    vm.mount();

    expect(vm.spies.didMount).toHaveBeenCalledOnce();
  });

  it('isMounted should be true after mount', () => {
    const vm = new TestViewModelImpl();
    vm.mount();
    expect(vm.isMounted).toBe(true);
  });

  it('unmount should be called once', () => {
    const vm = new TestViewModelImpl();

    vm.unmount();

    expect(vm.spies.unmount).toHaveBeenCalledOnce();
  });

  it('didUnmount should be called after unmount', () => {
    const vm = new TestViewModelImpl();

    vm.unmount();

    expect(vm.spies.didUnmount).toHaveBeenCalledOnce();
  });

  it('isMounted should be false after unmount', () => {
    const vm = new TestViewModelImpl();
    vm.mount();
    vm.unmount();
    expect(vm.isMounted).toBe(false);
  });
});
