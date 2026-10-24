import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TextInput from './TextInput';

describe('TextInput', () => {
  it('names the input with its label, so a screen reader announces it', () => {
    render(<TextInput label="Email" type="email" />);

    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
  });

  it('keeps an id given by the caller', () => {
    render(<TextInput label="Email" id="contact-email" />);

    expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'contact-email');
  });

  it('shows an error under the input', () => {
    render(<TextInput label="Cover" error="Please enter a valid URL" />);

    expect(screen.getByText('Please enter a valid URL')).toBeVisible();
  });
});
