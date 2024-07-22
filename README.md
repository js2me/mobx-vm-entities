[![npm](https://img.shields.io/npm/v/mobx-vm-entities)](https://www.npmjs.com/package/mobx-vm-entities) 
[![license](https://img.shields.io/npm/l/mobx-vm-entities)](https://github.com/js2me/mobx-vm-entities/blob/master/LICENSE)  


> [!WARNING]  
> It's fine if you use this library from NPM package with a **static versioning** in case you
> want it for some pet-project or to test it's capabilities.
>
> But for production use it's **strongly recommended** to create a fork, because I do not write
> Changelogs and may break / add some functionality without notice.  

# mobx-vm-entities  

## Usage  


```tsx
import {
  AbstractViewModel,
  AbstractViewModelParams,
  ViewModelStoreImpl as LibViewModelStoreImpl,
  ViewModel,
  ViewModelCreateConfig,
  ViewModelStore,
  ViewModelHocConfig,
  ViewModelInputProps,
  ViewModelProps,
  withViewModel as withLibViewModel,
  useViewModel as useLibViewModel,
  ViewModelProps
} from "mobx-vm-entities";
import { observer } from "mobx-react-lite";

export class ViewModelImpl<
  Payload extends AnyObject = EmptyObject,
  ParentViewModel extends ViewModel<any> = ViewModel<any>,
> extends AbstractViewModel<Payload, ParentViewModel> {
  constructor(
    protected rootStore: RootStore,
    params: AbstractViewModelParams<Payload>,
  ) {
    super(params);
  }

  protected getParentViewModel(
    parentViewModelId: Maybe<string>,
  ): ParentViewModel | null {
    return this.rootStore.viewModels.get<ParentViewModel>(parentViewModelId);
  }
}


export class ViewModelStoreImpl
  extends LibViewModelStoreImpl
  implements ViewModelStore
{
  constructor(protected rootStore: RootStore) {
    super();
  }

  create<VM extends ViewModel<any, ViewModel<any, any>>>(
    config: ViewModelCreateConfig<VM>,
  ): VM {
    const VM = config.VM;

    const params: AbstractViewModelParams<VM['payload']> = {
      id: config.id,
      payload: config.payload,
      parentViewModelId: config.parentViewModelId,
    };

    return new VM(this.rootStore, params);
  }
}


export const useViewModels = () => {
  const rootStore = useRootStore();
  return rootStore.viewModels;
};

export const useViewModel = <T extends ViewModel<any, ViewModel<any, any>>>(
  idOrClass?: Maybe<string> | Class<T>,
): T => {
  const viewModels = useViewModels();
  return useLibViewModel(viewModels, idOrClass);
};


export function withViewModel<VM extends ViewModel<any>>(
  model: Class<VM>,
  config?: Omit<ViewModelHocConfig<VM>, 'useViewModels'>,
): <Props extends AnyObject = ViewModelProps<VM>>(
  Component: ComponentType<Props & ViewModelProps<VM>>,
) => (props: Omit<Props, 'model'> & ViewModelInputProps<VM>) => ReactNode {
  return withLibViewModel(model, {
    ...config,
    useViewModels,
  });
}


// ... 


rootStore.viewModels = new ViewModelStoreImpl(rootStore);


class MyButtonViewModel extends ViewModelImpl implements ViewModel {
  title = 'hello!'
}

const MyButtonView = observer(({ model }: ViewModelProps<MyButtonViewModel>) => {


  return (
    <button>{model.title}</button>
  )
})


export const MyButton = withViewModel(MyButtonViewModel)(MyButtonView);

```






