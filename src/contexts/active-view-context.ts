import { createContext } from 'react';

import { AnyViewModel } from '../view-model';

// will contains the view model
export const ActiveViewModelContext = createContext<AnyViewModel>(null as any);
