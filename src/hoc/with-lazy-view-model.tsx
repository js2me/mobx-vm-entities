import { ComponentType } from 'react';
import { loadable } from 'react-simple-loadable';

import { Class } from '../utils/types';

import { ViewModelHocConfig, withViewModel } from './with-view-model';

interface LazyViewAndModel {
  Model: Class<any>;
  View: ComponentType<any>;
}

export function withLazyViewModel(
  loadFunction: () => Promise<LazyViewAndModel>,
  config?: ViewModelHocConfig<any>,
) {
  return loadable(async () => {
    const { Model, View } = await loadFunction();
    return withViewModel(Model, config)(View);
  }, config?.fallback);
}
