import { ComponentProps, ComponentType, ReactNode } from 'react';
import { loadable } from 'react-simple-loadable';

import { Class } from '../utils/types';
import { ViewModel } from '../view-model';

import {
  ViewModelHocConfig,
  ViewModelInputProps,
  withViewModel,
} from './with-view-model';

interface LazyViewAndModel<
  TViewModel extends ViewModel<any>,
  TView extends ComponentType<any>,
> {
  Model: Class<TViewModel>;
  View: TView;
}

export function withLazyViewModel<
  TViewModel extends ViewModel<any>,
  TView extends ComponentType<any>,
>(
  loadFunction: () => Promise<LazyViewAndModel<TViewModel, TView>>,
  config?: ViewModelHocConfig<any>,
) {
  return loadable(async () => {
    const { Model, View } = await loadFunction();
    return withViewModel(Model, config)(View);
  }, config?.fallback) as unknown as (
    props: Omit<ComponentProps<TView>, 'model'> &
      ViewModelInputProps<TViewModel>,
  ) => ReactNode;
}
