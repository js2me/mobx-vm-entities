import { act, render, screen, } from '@testing-library/react';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { describe, expect, test } from 'vitest';

import { ViewModelsProvider } from '..';
import { TestViewModelStoreImpl } from '../view-model/abstract-view-model.store.test';
import { TestViewModelImpl } from '../view-model/view-model.impl.test';

import { ViewModelProps, withViewModel } from './with-view-model';
import { createCounter } from '../utils';

const createIdGenerator = (prefix?: string) => {
  const counter = createCounter();
  return () => (prefix || '') + counter().toString()
}

describe('withViewModel', () => {
  test('renders', () => {
    class VM extends TestViewModelImpl { }
    const View = ({ model }: ViewModelProps<VM>) => {
      return <div>{`hello ${model.id}`}</div>;
    };
    const Component = withViewModel(VM, { generateId: createIdGenerator() })(View);

    render(<Component />);
    expect(screen.getByText('hello VM_0')).toBeDefined();
  });

  test('renders nesting', () => {
    class VM1 extends TestViewModelImpl { }
    const View1 = ({
      children,
    }: ViewModelProps<VM1> & { children?: ReactNode }) => {
      return (
        <div data-testid="parent-container">
          <div>parent</div>
          <div>{children}</div>
        </div>
      );
    };
    const Component1 = withViewModel(VM1, { generateId: createIdGenerator() })(View1);

    const Component2 = withViewModel(class VM2 extends TestViewModelImpl { }, { generateId: createIdGenerator() })(
      () => {
        return <div>child</div>;
      },

    );

    render(
      <Component1>
        <Component2 />
      </Component1>,
    );
    expect(screen.getByTestId('parent-container')).toBe(`<div
  data-testid="parent-container"
>
  <div>
    parent
  </div>
  <div>
    <div>
      child
    </div>
  </div>
</div>`);
  });

  test('renders twice', async () => {
    class VM extends TestViewModelImpl { }
    const View = ({ model }: ViewModelProps<VM>) => {
      return <div>{`hello ${model.id}`}</div>;
    };
    const Component = withViewModel(VM, { generateId: createIdGenerator() })(View);

    render(
      <>
        <Component />
        <Component />
      </>,
    );
    expect(screen.getByText('hello VM_0')).toBeDefined();
    expect(screen.getByText('hello VM_1')).toBeDefined();
  });

  test('renders with fixed id', () => {
    class VM extends TestViewModelImpl { }
    const View = ({ model }: ViewModelProps<VM>) => {
      return <div>{`hello ${model.id}`}</div>;
    };
    const Component = withViewModel(VM, { id: 'my-test' })(View);

    render(<Component />);
    expect(screen.getByText('hello my-test')).toBeDefined();
  });

  test('renders twice with fixed id', async () => {
    class VM extends TestViewModelImpl { }
    const View = ({ model }: ViewModelProps<VM>) => {
      return <div>{`hello ${model.id}`}</div>;
    };
    const Component = withViewModel(VM, { id: 'my-test' })(View);

    render(
      <>
        <Component />
        <Component />
      </>,
    );
    expect(await screen.findAllByText('hello my-test')).toHaveLength(2);
  });

  test('renders with view model store', async () => {
    class VM extends TestViewModelImpl { }
    const View = observer(({ model }: ViewModelProps<VM>) => {
      return (
        <div>
          <div>{`hello my friend. Model has id ? ${!!model.id}`}</div>
        </div>
      );
    });
    const Component = withViewModel(VM)(View);
    const vmStore = new TestViewModelStoreImpl();

    const Wrapper = ({ children }: { children?: ReactNode }) => {
      return (
        <ViewModelsProvider value={vmStore}>{children}</ViewModelsProvider>
      );
    };

    await act(async () =>
      render(<Component />, {
        wrapper: Wrapper,
      }),
    );

    expect(
      screen.getByText('hello my friend. Model has id ? true'),
    ).toBeDefined();
  });
});
