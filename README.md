<img src="assets/logo.png" align="right" height="156" alt="logo" />

# mobx-view-model  

[![NPM version][npm-image]][npm-url] [![test status][github-test-actions-image]][github-actions-url] [![build status][github-build-actions-image]][github-actions-url] [![npm download][download-image]][download-url] [![bundle size][bundlephobia-image]][bundlephobia-url]


[npm-image]: http://img.shields.io/npm/v/mobx-view-model.svg
[npm-url]: http://npmjs.org/package/mobx-view-model
[github-test-actions-image]: https://github.com/js2me/mobx-view-model/workflows/Test/badge.svg
[github-build-actions-image]: https://github.com/js2me/mobx-view-model/workflows/Build/badge.svg
[github-actions-url]: https://github.com/js2me/mobx-view-model/actions
[download-image]: https://img.shields.io/npm/dm/mobx-view-model.svg
[download-url]: https://npmjs.org/package/mobx-view-model
[bundlephobia-url]: https://bundlephobia.com/result?p=mobx-view-model
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/mobx-view-model


_MobX ViewModel power for ReactJS_


## What package has   

### [`ViewModelImpl`](src/view-model/view-model.impl.ts), [`ViewModel`](src/view-model/view-model.ts)   
It is a class that helps to manage state and lifecycle of a component in **React**.  


### [`ViewModelStoreImpl`](src/view-model/view-model.store.impl.ts), [`ViewModelStore`](src/view-model/view-model.store.ts)  
It is store for managing view models.  
P.S not required entity for targeted usage of this package, but can be helpful for accessing view models from everywhere by view model id or view model class name.   


### [`useViewModel()`](src/hooks/use-view-model.ts)  
Hook that helps to get access to your view model in **React**.  
  Possible usage:   
    - `useViewModel<YourViewModel>()` - using generic to define type of returning view model instance  
    - `useViewModel<YourViewModel>(id)` - using `id` to define specific identifier of returning view model instance and generic for the same as above usage    


### [`withViewModel()`](src/hoc/with-view-model.tsx)  
Required for usage HOC that connects your `ViewModel` class with `View` (**React** Component)  
  Possible usage:   
    - `withViewModel(ViewModel)(View)` - simple usage   
    - `withViewModel(ViewModel, { factory })(View)` -  advanced usage that needed to create your own implementations of `withViewModel` HOC, `ViewModelStore` and `ViewModel` classes.Example below:
```tsx
withViewModel(ViewModel, {
  factory: (config) => {
    // also you can achieve this your view model store implementation
    return new config.VM(rootStore, config);
  }
})(View)
```  


### [`withLazyViewModel()`](src/hoc/with-lazy-view-model.tsx)  
Optional for usage HOC that doing the same thing as `withViewModel`, but fetching `ViewModel` and `View` "lazy"  

## Simple usage  

```tsx
import { ViewModelProps, ViewModelImpl, withViewModel } from 'mobx-view-model';

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
} from 'mobx-view-model';

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
import { ViewModel as ViewModelBase } from 'mobx-view-model';

export interface ViewModel<
  Payload extends AnyObject = EmptyObject,
  ParentViewModel extends ViewModel<any> = ViewModel<any, any>,
> extends ViewModelBase<Payload, ParentViewModel> {}
```

`view-model.impl.ts`  
```ts
import { AbstractViewModel, AbstractViewModelParams } from 'mobx-view-model';
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
import { ViewModelStore } from 'mobx-view-model';
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
import { ViewModelProps, withViewModel } from 'mobx-view-model';
import { ViewModelImpl } from '@/shared/lib/mobx';

export class MyPageVM extends ViewModelImpl {
  @observable
  accessor state = '';

  async mount() {
    // this.isMounted = false;
    await this.rootStore.beerApi.takeBeer();
    super.mount(); // this.isMounted = true
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