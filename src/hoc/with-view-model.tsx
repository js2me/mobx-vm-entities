import { observer } from 'mobx-react-lite';
import {
  ComponentType,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';

import { ActiveViewContext, ViewModelsContext } from '../contexts';
import { ViewModel, ViewModelCreateConfig } from '../view-model';

export type ViewModelProps<VM extends ViewModel<any>> = {
  model: VM;
};

export type ViewModelInputProps<VM extends ViewModel<any>> =
  VM['payload'] extends EmptyObject ? AnyObject : { payload: VM['payload'] };

export type ViewModelHocConfig<VM extends ViewModel<any>> = {
  /**
   * Уникальный идентификатор вьюшки
   */
  id?: Maybe<string>;
  fallback?: ComponentType;
  /**
   * Доп. данные, которые могут быть полезны при создании VM
   */
  ctx?: AnyObject;
  /**
   * Функция, в которой можно вызывать доп. реакт хуки в результирующем компоненте
   */
  reactHooks?: (allProps: any) => void;

  /**
   * Функция, которая должна возвращать payload для VM
   * по умолчанию это - (props) => props.payload
   */
  getPayload?: (allProps: any) => any;

  /**
   * Функция создания экземпляра класса VM
   */
  factory?: (config: ViewModelCreateConfig<VM>) => VM;
};

export function withViewModel<VM extends ViewModel<any>>(
  model: Class<VM>,
  config?: ViewModelHocConfig<VM>,
): <Props extends AnyObject = ViewModelProps<VM>>(
  Component: ComponentType<Props & ViewModelProps<VM>>,
) => (props: Omit<Props, 'model'> & ViewModelInputProps<VM>) => ReactNode;

export function withViewModel(
  Model: Class<any>,
  config?: ViewModelHocConfig<any>,
) {
  const ctx: AnyObject = config?.ctx ?? {};

  return (Component: ComponentType<any>) => {
    const instances = new Map<string, ViewModel>();

    const ConnectedViewModel = observer((allProps: any) => {
      const { payload: rawPayload, ...componentProps } = allProps;

      const payload = config?.getPayload
        ? config.getPayload(allProps)
        : rawPayload;

      const idRef = useRef<string>('');
      const viewModels = useContext(ViewModelsContext);
      const parentViewModelId = useContext(ActiveViewContext) || null;

      if (!idRef.current) {
        idRef.current = viewModels.generateViewModelId({
          ctx,
          id: config?.id,
          VM: Model,
          parentViewModelId,
          fallback: config?.fallback,
          instances,
        });
      }

      const id = idRef.current;

      if (!instances.has(id)) {
        const configCreate: ViewModelCreateConfig<any> = {
          id,
          parentViewModelId,
          payload,
          VM: Model,
          fallback: config?.fallback,
          instances,
          ctx,
        };

        const instance =
          config?.factory?.(configCreate) ??
          viewModels.createViewModel<any>(configCreate);

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

      config?.reactHooks?.(allProps);

      if (viewModels.isAbleToRenderView(id) && instance) {
        return (
          <ActiveViewContext.Provider value={id}>
            <Component {...(componentProps as any)} model={instance} />
          </ActiveViewContext.Provider>
        );
      }

      return config?.fallback ? <config.fallback /> : null;
    });

    if (process.env.NODE_ENV !== 'production') {
      Object.assign(ConnectedViewModel, {
        displayName: `ConnectedViewModel(${Model.name}->Component)`,
      });
    }

    return ConnectedViewModel;
  };
}
