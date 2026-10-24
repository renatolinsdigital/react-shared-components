import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Select from './Select';

describe('Select', () => {
  it('names the select with its label and offers the placeholder first', () => {
    render(
      <Select
        label="Role"
        placeholder="Select..."
        options={[{ value: 'ADMIN', label: 'Admin' }]}
        defaultValue=""
      />,
    );

    const select = screen.getByLabelText('Role');
    expect(select).toHaveDisplayValue('Select...');
    expect(screen.getByRole('option', { name: 'Admin' })).toBeInTheDocument();
  });
});
