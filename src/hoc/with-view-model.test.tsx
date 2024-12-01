import { act, render, screen } from '@testing-library/react';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { describe, expect, test } from 'vitest';

import { ViewModelsProvider } from '..';
import { createCounter } from '../utils';
import { TestViewModelStoreImpl } from '../view-model/abstract-view-model.store.test';
import { TestViewModelImpl } from '../view-model/view-model.impl.test';

import { ViewModelProps, withViewModel } from './with-view-model';

const createIdGenerator = (prefix?: string) => {
  const counter = createCounter();
  return () => (prefix ?? '') + counter().toString();
};

describe('withViewModel', () => {
  test('renders', () => {
    class VM extends TestViewModelImpl {}
    const View = ({ model }: ViewModelProps<VM>) => {
      return <div>{`hello ${model.id}`}</div>;
    };
    const Component = withViewModel(VM, { generateId: createIdGenerator() })(
      View,
    );

    render(<Component />);
    expect(screen.getByText('hello VM_0')).toBeDefined();
  });

  test('renders nesting', () => {
    const Component1 = withViewModel(TestViewModelImpl)(({
      children,
    }: {
      children?: ReactNode;
    }) => {
      return (
        <div data-testid={'parent-container'}>
          <div>parent</div>
          {children}
        </div>
      );
    });
    const Component2 = withViewModel(TestViewModelImpl)(() => {
      return <div>child</div>;
    });

    const { container } = render(
      <Component1>
        <Component2 />
      </Component1>,
    );

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        data-testid="parent-container"
      >
        <div>
          parent
        </div>
        <div>
          child
        </div>
      </div>
    `);
  });

  test('renders twice', async () => {
    class VM extends TestViewModelImpl {}
    const View = ({ model }: ViewModelProps<VM>) => {
      return <div>{`hello ${model.id}`}</div>;
    };
    const Component = withViewModel(VM, { generateId: createIdGenerator() })(
      View,
    );

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
    class VM extends TestViewModelImpl {}
    const View = ({ model }: ViewModelProps<VM>) => {
      return <div>{`hello ${model.id}`}</div>;
    };
    const Component = withViewModel(VM, { id: 'my-test' })(View);

    render(<Component />);
    expect(screen.getByText('hello my-test')).toBeDefined();
  });

  test('renders twice with fixed id', async () => {
    class VM extends TestViewModelImpl {}
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
    class VM extends TestViewModelImpl {}
    const View = observer(({ model }: ViewModelProps<VM>) => {
      return (
        <div>
          <div>{`hello my friend. Model id is ${model.id}`}</div>
        </div>
      );
    });
    const Component = withViewModel(VM, { generateId: () => '1' })(View);
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

    expect(screen.getByText('hello my friend. Model id is VM_1')).toBeDefined();
  });
});
