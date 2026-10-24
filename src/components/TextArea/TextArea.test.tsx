import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TextArea from './TextArea';

describe('TextArea', () => {
  it('names the text area with its label, so a screen reader announces it', () => {
    render(<TextArea label="Message" />);

    expect(screen.getByLabelText('Message').tagName).toBe('TEXTAREA');
  });
});
