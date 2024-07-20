import { observer } from 'mobx-react-lite';
import {
  ComponentType,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';

import { ViewModel, ViewModelClass, ViewModelStore } from '../view-model';

export const ActiveViewContext = createContext<string>('');

type ViewModelHocContext = {
  generateNumericId?: (() => string) | undefined;
  shortStaticId?: string;
};

export type ViewModelProps<VM extends ViewModel<any>> = {
  model: VM;
};

export type ViewModelInputProps<VM extends ViewModel<any>> =
  VM['payload'] extends EmptyObject ? AnyObject : { payload: VM['payload'] };

export type ViewModelFabric<VM extends ViewModel<any>> = (
  model: ViewModelClass<VM>,
  rootStore: RootStore,
  payload: VM['payload'],
  id: string,
  parentVM: string | null,
  Fallback?: ComponentType,
) => VM;

export type ViewModelHocConfig<VM extends ViewModel<any>> = {
  useViewModels: () => ViewModelStore;

  id?: Maybe<string>;
  fallback?: ComponentType;
  fabric?: ViewModelFabric<VM>;
  generateId?: (
    vmClass: ViewModelClass<VM>,
    id: Maybe<string>,
    ctx: ViewModelHocContext,
  ) => string;
};

export function withViewModel<VM extends ViewModel<any>>(
  model: Class<VM>,
  config: ViewModelHocConfig<VM>,
): <Props extends AnyObject = ViewModelProps<VM>>(
  Component: ComponentType<Props & ViewModelProps<VM>>,
) => (props: Omit<Props, 'model'> & ViewModelInputProps<VM>) => ReactNode;

export function withViewModel(
  Model: Class<any>,
  config: ViewModelHocConfig<any>,
) {
  const ctx: AnyObject = {};

  const useViewModels = config.useViewModels;

  return (Component: ComponentType<any>) => {
    const instances = new Map<string, ViewModel>();

    const ConnectedViewModel = observer(({ payload, ...props }: any) => {
      const idRef = useRef<string>('');
      const parentViewModelId = useContext(ActiveViewContext) || null;
      const viewModels = useViewModels();

      if (!idRef.current) {
        idRef.current = viewModels.generateViewModelId({
          ctx,
          id: config.id,
          VM: Model,
          parentViewModelId,
          fallback: config.fallback,
          instances,
        });
      }

      const id = idRef.current;

      if (!instances.has(id)) {
        const instance = viewModels.create<any>({
          id,
          parentViewModelId,
          payload,
          VM: Model,
          fallback: config.fallback,
          instances,
        });

        instances.set(id, instance);
      }

      const instance: ViewModel = instances.get(id)!;

      useEffect(() => {
        viewModels.attach(instance);

        return () => {
          viewModels.detach(id);
          instances.delete(id);
        };
      }, []);

      useLayoutEffect(() => {
        instance.setPayload(payload);
      }, [payload]);

      if (viewModels.isAbleToRenderView(id) && instance) {
        return (
          <ActiveViewContext.Provider value={id}>
            <Component {...(props as any)} model={instance} />
          </ActiveViewContext.Provider>
        );
      }

      return config.fallback ? <config.fallback /> : null;
    });

    if (process.env.NODE_ENV !== 'production') {
      Object.assign(ConnectedViewModel, {
        displayName: `ConnectedViewModel(${Model.name}->Component)`,
      });
    }

    return ConnectedViewModel;
  };
}
