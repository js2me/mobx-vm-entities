import { useContext } from 'react';

import { ActiveViewModelContext, ViewModelsContext } from '../contexts';
import { AnyViewModel, ViewModelLookup } from '../view-model';

export const useViewModel = <T extends AnyViewModel>(
  lookupPayload?: ViewModelLookup<T>,
): T => {
  const viewModels = useContext(ViewModelsContext);
  const activeViewModel = useContext(ActiveViewModelContext);
  const model = viewModels?.get<T>(lookupPayload);

  if (lookupPayload == null || !viewModels) {
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
    let displayName: string = '';

    if (typeof lookupPayload === 'string') {
      displayName = lookupPayload;
    } else if ('name' in lookupPayload) {
      displayName = lookupPayload.name;
    } else {
      displayName = lookupPayload['displayName'];
    }

    throw new Error(`View model not found for ${displayName}`);
  }

  return model;
};
