import { useContext } from 'react';

import { ActiveViewModelContext, ViewModelsContext } from '../contexts';
import { Class, Maybe } from '../utils/types';
import { AnyViewModel } from '../view-model';

export const useViewModel = <T extends AnyViewModel>(
  idOrClass?: Maybe<string> | Class<T>,
): T => {
  const viewModels = useContext(ViewModelsContext);
  const activeViewModel = useContext(ActiveViewModelContext);
  const model = viewModels?.get<T>(idOrClass);

  if (idOrClass == null || !viewModels) {
    if (process.env.NODE_ENV !== 'production' && !viewModels) {
      console.warn(
        'unabled to get access to view model by id or class name withouting using ViewModelsStore. Last active view model will be returned',
      );
    }

    if (!activeViewModel) {
      throw new Error('No active view model');
    }

    return activeViewModel as unknown as T;
  }

  if (!model) {
    throw new Error(
      `View model not found for ${typeof idOrClass === 'string' ? idOrClass : idOrClass.name}`,
    );
  }

  return model;
};
