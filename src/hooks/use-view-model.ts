import { useContext } from 'react';

import { ActiveViewContext, ViewModelsContext } from '../contexts';
import { Class, Maybe } from '../utils/types';
import type { ViewModel } from '../view-model/view-model';

export const useViewModel = <T extends ViewModel<any, any>>(
  idOrClass?: Maybe<string> | Class<T>,
): T => {
  const viewModels = useContext(ViewModelsContext);
  const activeViewId = useContext(ActiveViewContext);
  const model = viewModels.get<T>(idOrClass ?? activeViewId);

  if (!model) {
    throw new Error('No model for view');
  }

  return model;
};
