import { useContext } from 'react';

import { ActiveViewContext, ViewModelsContext } from '../contexts';
import type { ViewModel } from '../view-model/view-model';

export const useViewModel = <T extends ViewModel<any>>(
  idOrClass?: Maybe<string> | Class<T>,
): T => {
  const viewModels = useContext(ViewModelsContext);
  const activeViewId = useContext(ActiveViewContext);
  const model = viewModels.get<T>(idOrClass ?? activeViewId);

  if (!model) {
    throw new Error('Нет модели для представления');
  }

  return model;
};
