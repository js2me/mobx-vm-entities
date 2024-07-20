import type { ViewModelStore } from '../src';

declare global {
  interface RootStore {
    viewModels: ViewModelStore;
  }

  declare const process: {
    env: { NODE_ENV?: string };
  };
}

export {};
