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

  if (!activeViewModel && !model) {
    throw new Error('No model for view');
  }

  return (activeViewModel as unknown as T) || model;

  // if (idOrClass == null) {
  //   if (!activeViewModel) {
  //     throw new Error('No active view model');
  //   }

  //   return activeViewModel as unknown as T;
  // }

  // if (!model) {
  //   throw console.error('view model not found for', idOrClass);
  // }

  // return model;
};
