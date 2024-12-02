import { act, render } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, expect, test } from 'vitest';

import { ViewModelsProvider } from '..';
import { withViewModel } from '../hoc';
import { TestViewModelStoreImpl } from '../view-model/abstract-view-model.store.test';
import { TestViewModelImpl } from '../view-model/view-model.impl.test';

import { useViewModel } from './use-view-model';

describe('withViewModel', () => {
  const createDepthComponent = (depth: number) => {
    class VM1 extends TestViewModelImpl {
      depth = `${depth}`;
    }
    return withViewModel(VM1)(({ children }: { children?: ReactNode }) => {
      const model = useViewModel<VM1>();
      return (
        <div>
          <span>{`depth: ${model.depth}`}</span>
          {children}
        </div>
      );
    });
  };

  const vmStore = new TestViewModelStoreImpl();

  const VMStoreWrapper = ({ children }: { children?: ReactNode }) => {
    return <ViewModelsProvider value={vmStore}>{children}</ViewModelsProvider>;
  };

  test('renders (1 depth)', async () => {
    const Component = createDepthComponent(1);
    const { container } = await act(() => render(<Component />));
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        <span>
          depth: 1
        </span>
      </div>
    `);
  });

  test('renders (2 depths)', async () => {
    const Component1 = createDepthComponent(1);
    const Component2 = createDepthComponent(2);

    const { container } = await act(() =>
      render(
        <Component1>
          <Component2 />
        </Component1>,
      ),
    );
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        <span>
          depth: 1
        </span>
        <div>
          <span>
            depth: 2
          </span>
        </div>
      </div>
    `);
  });

  test('renders (3 depths)', async () => {
    const Component1 = createDepthComponent(1);
    const Component2 = createDepthComponent(2);
    const Component3 = createDepthComponent(3);

    const { container } = await act(() =>
      render(
        <Component1>
          <Component2>
            <Component3 />
          </Component2>
        </Component1>,
      ),
    );

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        <span>
          depth: 1
        </span>
        <div>
          <span>
            depth: 2
          </span>
          <div>
            <span>
              depth: 3
            </span>
          </div>
        </div>
      </div>
    `);
  });

  test('renders (4 depths)', async () => {
    const Component1 = createDepthComponent(1);
    const Component2 = createDepthComponent(2);
    const Component3 = createDepthComponent(3);
    const Component4 = createDepthComponent(4);

    const { container } = await act(() =>
      render(
        <Component1>
          <Component2>
            <Component3>
              <Component4 />
            </Component3>
          </Component2>
        </Component1>,
      ),
    );
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        <span>
          depth: 1
        </span>
        <div>
          <span>
            depth: 2
          </span>
          <div>
            <span>
              depth: 3
            </span>
            <div>
              <span>
                depth: 4
              </span>
            </div>
          </div>
        </div>
      </div>
    `);
  });

  test('renders (5 depths)', async () => {
    const Component1 = createDepthComponent(1);
    const Component2 = createDepthComponent(2);
    const Component3 = createDepthComponent(3);
    const Component4 = createDepthComponent(4);
    const Component5 = createDepthComponent(5);

    const { container } = await act(() =>
      render(
        <Component1>
          <Component2>
            <Component3>
              <Component4>
                <Component5 />
              </Component4>
            </Component3>
          </Component2>
        </Component1>,
      ),
    );
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        <span>
          depth: 1
        </span>
        <div>
          <span>
            depth: 2
          </span>
          <div>
            <span>
              depth: 3
            </span>
            <div>
              <span>
                depth: 4
              </span>
              <div>
                <span>
                  depth: 5
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
  });

  describe('with using ViewModelStore', () => {
    test('renders (1 depth)', async () => {
      const Component = createDepthComponent(1);
      const { container } = await act(async () =>
        render(<Component />, {
          wrapper: VMStoreWrapper,
        }),
      );
      expect(container.firstChild).toMatchInlineSnapshot(`
        <div>
          <span>
            depth: 1
          </span>
        </div>
      `);
    });

    test('renders (2 depths)', async () => {
      const Component1 = createDepthComponent(1);
      const Component2 = createDepthComponent(2);

      const { container } = await act(async () =>
        render(
          <Component1>
            <Component2 />
          </Component1>,
          {
            wrapper: VMStoreWrapper,
          },
        ),
      );
      expect(container.firstChild).toMatchInlineSnapshot(`
        <div>
          <span>
            depth: 1
          </span>
          <div>
            <span>
              depth: 2
            </span>
          </div>
        </div>
      `);
    });

    test('renders (3 depths)', async () => {
      const Component1 = createDepthComponent(1);
      const Component2 = createDepthComponent(2);
      const Component3 = createDepthComponent(3);

      const { container } = await act(async () =>
        render(
          <Component1>
            <Component2>
              <Component3 />
            </Component2>
          </Component1>,
          {
            wrapper: VMStoreWrapper,
          },
        ),
      );

      expect(container.firstChild).toMatchInlineSnapshot(`
        <div>
          <span>
            depth: 1
          </span>
          <div>
            <span>
              depth: 2
            </span>
            <div>
              <span>
                depth: 3
              </span>
            </div>
          </div>
        </div>
      `);
    });

    test('renders (4 depths)', async () => {
      const Component1 = createDepthComponent(1);
      const Component2 = createDepthComponent(2);
      const Component3 = createDepthComponent(3);
      const Component4 = createDepthComponent(4);

      const { container } = await act(async () =>
        render(
          <Component1>
            <Component2>
              <Component3>
                <Component4 />
              </Component3>
            </Component2>
          </Component1>,
          {
            wrapper: VMStoreWrapper,
          },
        ),
      );
      expect(container.firstChild).toMatchInlineSnapshot(`
        <div>
          <span>
            depth: 1
          </span>
          <div>
            <span>
              depth: 2
            </span>
            <div>
              <span>
                depth: 3
              </span>
              <div>
                <span>
                  depth: 4
                </span>
              </div>
            </div>
          </div>
        </div>
      `);
    });

    test('renders (5 depths)', async () => {
      const Component1 = createDepthComponent(1);
      const Component2 = createDepthComponent(2);
      const Component3 = createDepthComponent(3);
      const Component4 = createDepthComponent(4);
      const Component5 = createDepthComponent(5);

      const { container } = await act(async () =>
        render(
          <Component1>
            <Component2>
              <Component3>
                <Component4>
                  <Component5 />
                </Component4>
              </Component3>
            </Component2>
          </Component1>,
          {
            wrapper: VMStoreWrapper,
          },
        ),
      );
      expect(container.firstChild).toMatchInlineSnapshot(`
        <div>
          <span>
            depth: 1
          </span>
          <div>
            <span>
              depth: 2
            </span>
            <div>
              <span>
                depth: 3
              </span>
              <div>
                <span>
                  depth: 4
                </span>
                <div>
                  <span>
                    depth: 5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `);
    });
  });
});
