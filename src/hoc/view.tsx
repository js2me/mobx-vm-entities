import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';

import { AnyViewModel } from '../view-model';

import { ViewModelProps } from './with-view-model';

export function view<TViewModel extends AnyViewModel>(
  functionComponent: (props: ViewModelProps<TViewModel>) => ReactNode,
) {
  return observer(functionComponent) as unknown as any;
}
