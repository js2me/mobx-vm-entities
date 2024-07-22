[![npm](https://img.shields.io/npm/v/mobx-vm-entities)](https://www.npmjs.com/package/mobx-vm-entities) 
[![license](https://img.shields.io/npm/l/mobx-vm-entities)](https://github.com/js2me/mobx-vm-entities/blob/master/LICENSE)  


> [!WARNING]  
> It's fine if you use this library from NPM package with a **static versioning** in case you
> want it for some pet-project or to test it's capabilities.
>
> But for production use it's **strongly recommended** to create a fork, because I do not write
> Changelogs and may break / add some functionality without notice.  

# mobx-vm-entities  

## Usage (with using `rootStore`)  


### 1. Create `ViewModelImpl` class  

This class you will needed for creating your own view model classes  
You can implement your own solution based on `ViewModel<Payload, ParentViewModel>`, but `AbstractViewModel` has a lot of ready solutions like `mount()`, or `payloadChanged()`  
Only one thing that you should implement is the `getParentViewModel` and `constructor` because it requires (in most cases) `RootStore`  


```tsx  
import {
  AbstractViewModel,
  AbstractViewModelParams,
  ViewModel,
} from 'mobx-vm-entities';

export class ViewModelImpl<
    Payload extends AnyObject = EmptyObject,
    ParentViewModel extends ViewModel<any> = ViewModel<any>,
  >
  extends AbstractViewModel<Payload, ParentViewModel>
  implements ViewModel<Payload, ParentViewModel>
{
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

```

### 2. Create `ViewModelStoreImpl` Class  

This class will contains info about all your view model instances and will have fabric for creating instances of the your `ViewModelImpl` classes.  
Because it requires (in most cases) the `rootStore`  

```tsx  
import {
  AbstractViewModelParams,
  AbstractViewModelStore,
  ViewModel,
  ViewModelCreateConfig,
  ViewModelStore,
} from 'mobx-vm-entities';

export class ViewModelStoreImpl
  extends AbstractViewModelStore
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

```  

### 3. Attach your `ViewModelStore` to `rootStore`  

```ts
rootStore.viewModels = new ViewModelStoreImpl(rootStore);
```

### 4. Add `ViewModelsProvider` at the root of your React app  


```tsx
import { ViewModelsProvider } from 'mobx-vm-entities';
import { observer } from 'mobx-react-lite';

import { useRootStore } from '../../root-store'; // code line maybe different for your case

export const App = observer(() => {
  const rootStore = useRootStore();


  return (
    <ViewModelsProvider value={rootStore.viewModels}>
      <Router />
      <Notifications />
      <ModalsContainer />
    </ViewModelsProvider>
  )
})
```


### 4. Use it  

```tsx
import { ViewModelImpl } from "your-import";

type Payload = {
  test: number
}

class MyButtonViewModel extends ViewModelImpl<Payload> {
  title = 'click me!';

  mount() {
    super.mount();

    this.disposer.add(
      reaction(() => this.payload.test > 10, (ok) => {
        console.info("ok", ok)
      })
    )
  }

  unmount() {
    super.unmount();
  }

  payloadChanged(payload) {
    console.info('payload', payload);
  }

  handleClick = () => {
    console.info("click")
  }

  dispose() {
    super.dispose();

    // your dispose
  }
}

const MyButtonView = observer(({ model }: ViewModelProps<MyButtonViewModel>) => {


  return (
    <button onClick={model.handleClick}>{model.title}</button>
  )
})


export const MyButton = withViewModel(
  MyButtonViewModel,
  // additional config
  // {
  //   id?: string, // could be used to set fixed identifier for singleton view models  
  //   fallback?: ComponentType, // render fallback component  
  //   ctx?: Record<string, any>, // additional object to customize something using viewModels store  
  //   factory?:  (config: ViewModelCreateConfig<VM>) => VM; // function which create the instance of this view model  
  // }
)(MyButtonView);


export const SomeOtherComponent = () => {
  return (
    <div>
      <MyButton payload={{ test: 10 }} />
    </div>
  )
}

```








