import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { ViewModelImpl } from '../view-model';

import { view } from './view';
import { withViewModel } from './with-view-model';

describe('withViewModel', () => {
  test('renders', () => {
    class VM extends ViewModelImpl {}
    const View = view<VM>(({ model }) => {
      return <div>{`hello ${model.id}`}</div>;
    });
    const Component = withViewModel(VM)(View);

    render(<Component />);
    expect(screen.getByText('hello VM_0_00000')).toBeDefined();
  });
});
