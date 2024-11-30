# mobx-vm-entities   

MobX ViewModel power for ReactJS  

## Simple usage  

```tsx
import { ViewModelProps, ViewModelImpl, withViewModel } from 'mobx-vm-entities';
export class MyPageVM extends ViewModelImpl<{ payloadA: string }> {
  @observable
  accessor state = '';

  mount() {
    super.mount();
  }

  didMount() {
    console.info('did mount');
  }

  unmount() {
    super.unmount();
  }
}

const MyPageView = observer(({ model }: ViewModelProps<MyPageVM>) => {
  return <div>{model.state}</div>;
});

export const MyPage = withViewModel(MyPageVM)(MyPageView);

<MyPage payload={{ payloadA: '1' }} />
```

## Detailed Configuration  

### Make your own ViewModelStore implementation   

`view-model.store.impl.ts`  
```ts
import {
  AbstractViewModelParams,
  AbstractViewModelStore,
  ViewModel,
  ViewModelCreateConfig,
} from 'mobx-vm-entities';

export class ViewModelStoreImpl extends AbstractViewModelStore {
  constructor(protected rootStore: RootStore) {
    super();
  }

  createViewModel<VM extends ViewModel<any, ViewModel<any, any>>>(
    config: ViewModelCreateConfig<VM>,
  ): VM {
    const VM = config.VM;
    // here is you sending rootStore as first argument into VM (your view model implementation)
    return new VM(this.rootStore, config);
  }
}
```

### Make your own `ViewModel` implementation with sharing `RootStore`   

`view-model.ts`  
```ts
import { ViewModel as ViewModelBase } from 'mobx-vm-entities';

export interface ViewModel<
  Payload extends AnyObject = EmptyObject,
  ParentViewModel extends ViewModel<any> = ViewModel<any, any>,
> extends ViewModelBase<Payload, ParentViewModel> {}
```

`view-model.impl.ts`  
```ts
import { AbstractViewModel, AbstractViewModelParams } from 'mobx-vm-entities';
import { ViewModel } from './view-model';

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

  get queryParams() {
    return this.rootStore.router.queryParams.data;
  }

  protected getParentViewModel(
    parentViewModelId: Maybe<string>,
  ): ParentViewModel | null {
    return this.rootStore.viewModels.get<ParentViewModel>(parentViewModelId);
  }
}

```

### Add `ViewModelStore` into your `RootStore`   

```ts
import { ViewModelStore } from 'mobx-vm-entities';
import { ViewModelStoreImpl } from '@/shared/lib/mobx';


export class RootStoreImpl implements RootStore {
  viewModels: ViewModelStore;

  constructor() {
    this.viewModels = new ViewModelStoreImpl(this);
  }
}
```  


### Create `View` with `ViewModel`   

```tsx
import { ViewModelProps, withViewModel } from 'mobx-vm-entities';
import { ViewModelImpl } from '@/shared/lib/mobx';

export class MyPageVM extends ViewModelImpl {
  @observable
  accessor state = '';

  async mount() {
    super.mount();

    await this.rootStore.myApi.load()
  }

  didMount() {
    console.info('did mount');
  }

  unmount() {
    super.unmount();
  }
}

const MyPageView = observer(({ model }: ViewModelProps<MyPageVM>) => {
  return <div>{model.state}</div>;
});

export const MyPage = withViewModel(MyPageVM)(MyPageView);
```