import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { ViewModelsContext } from '../contexts';
import { TestViewModelStoreImpl } from '../view-model/abstract-view-model.store.test';
import { TestViewModelImpl } from '../view-model/view-model.impl.test';

import { ViewModelProps, withViewModel } from './with-view-model';

describe('withViewModel', () => {
  test('renders', () => {
    class VM extends TestViewModelImpl {}
    const View = ({ model }: ViewModelProps<VM>) => {
      return <div>{`hello ${model.id}`}</div>;
    };
    const Component = withViewModel(VM)(View);

    render(<Component />);
    expect(screen.getByText('hello VM_0_00000')).toBeDefined();
  });

  test('renders twice', async () => {
    class VM extends TestViewModelImpl {}
    const View = ({ model }: ViewModelProps<VM>) => {
      return <div>{`hello ${model.id}`}</div>;
    };
    const Component = withViewModel(VM)(View);

    render(
      <>
        <Component />
        <Component />
      </>,
    );
    expect(screen.getByText('hello VM_1_00000')).toBeDefined();
    expect(screen.getByText('hello VM_1_00001')).toBeDefined();
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

  test('renders with view model store', () => {
    class VM extends TestViewModelImpl {}
    const View = ({ model }: ViewModelProps<VM>) => {
      return <div>{`hello ${model.id}`}</div>;
    };
    const Component = withViewModel(VM)(View);
    const vmStore = new TestViewModelStoreImpl();

    render(
      <div>
        <ViewModelsContext.Provider value={vmStore} />
      </div>,
    );

    screen.debug();
    expect(screen.getByText('hello VM_0_00000')).toBeDefined();
  });
});
