/* eslint-disable sonarjs/no-nested-functions */
import { observer } from 'mobx-react-lite';
import {
  ComponentType,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';

import { ActiveViewContext, ViewModelsContext } from '../contexts';
import { AnyObject, Class, EmptyObject, Maybe } from '../utils/types';
import { AnyViewModel, ViewModel, ViewModelCreateConfig } from '../view-model';

declare const process: { env: { NODE_ENV?: string } };

export type ViewModelProps<VM extends AnyViewModel> = {
  model: VM;
};

export type ViewModelInputProps<VM extends AnyViewModel> =
  VM['payload'] extends EmptyObject ? AnyObject : { payload: VM['payload'] };

export type ViewModelHocConfig<VM extends AnyViewModel> = {
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

export type ComponentWithViewModel<
  TViewModel extends AnyViewModel,
  TComponentOriginProps extends AnyObject = ViewModelProps<TViewModel>,
> = (
  props: Omit<TComponentOriginProps, 'model'> & ViewModelInputProps<TViewModel>,
) => TViewModel;

export function withViewModel<TViewModel extends AnyViewModel>(
  model: Class<TViewModel>,
  config?: ViewModelHocConfig<TViewModel>,
): <TComponentOriginProps extends AnyObject = ViewModelProps<TViewModel>>(
  Component: ComponentType<TComponentOriginProps & ViewModelProps<TViewModel>>,
) => ComponentWithViewModel<TViewModel, TComponentOriginProps>;

export function withViewModel(
  Model: Class<any>,
  config?: ViewModelHocConfig<any>,
) {
  const context: AnyObject = config?.ctx ?? {};

  return (Component: ComponentType<any>) => {
    const instances = new Map<string, AnyViewModel>();

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
          ctx: context,
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
          parentViewModel:
            (parentViewModelId && instances.get(parentViewModelId)) || null,
          fallback: config?.fallback,
          instances,
          ctx: context,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      useLayoutEffect(() => {
        instance.setPayload(payload);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
