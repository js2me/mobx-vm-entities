import { ComponentType } from 'react';

import { AnyObject, Class, Maybe } from '../utils/types';

import { AbstractViewModelParams } from './abstract-view-model.types';
import { ViewModel } from './view-model';
import { AnyViewModel } from './view-model.types';

export interface ViewModelGenerateIdConfig<VM extends AnyViewModel> {
  VM: Class<VM>;
  id: Maybe<string>;
  ctx: AnyObject;
  parentViewModelId: string | null;
  fallback?: ComponentType;
  instances: Map<string, ViewModel>;
}

export interface ViewModelCreateConfig<VM extends AnyViewModel>
  extends AbstractViewModelParams<VM['payload'], VM['parentViewModel']> {
  VM: Class<VM>;
  fallback?: ComponentType;
  instances: Map<string, ViewModel>;
}
