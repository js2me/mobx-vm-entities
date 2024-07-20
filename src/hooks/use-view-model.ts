import { useContext } from 'react';

import { ActiveViewContext } from '../hoc';
import { ViewModelStore } from '../view-model';
import type { ViewModel } from '../view-model/view-model';

export const useViewModel = <T extends ViewModel<any>>(
  viewModels: ViewModelStore,
  idOrClass?: Maybe<string> | Class<T>,
): T => {
  const activeViewId = useContext(ActiveViewContext);
  const model = viewModels.get<T>(idOrClass ?? activeViewId);

  if (!model) {
    throw new Error('Нет модели для представления');
  }

  return model;
};
