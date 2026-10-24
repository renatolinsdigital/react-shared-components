import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastProvider, useToast } from './ToastProvider';

const EXIT_ANIMATION_MS = 220;

function ToastButton({ durationMs }: { durationMs?: number }) {
  const { addToast } = useToast();
  return <button onClick={() => addToast('Project saved.', 'success', durationMs)}>Save</button>;
}

function renderWithToasts(durationMs?: number) {
  render(
    <ToastProvider dismissLabel="Dismiss">
      <ToastButton durationMs={durationMs} />
    </ToastProvider>,
  );
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('ToastProvider', () => {
  it('shows a toast and removes it once its time is up', () => {
    renderWithToasts(1000);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByText('Project saved.')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1000 + EXIT_ANIMATION_MS));
    expect(screen.queryByText('Project saved.')).not.toBeInTheDocument();
  });

  it('removes a toast early from its close button', () => {
    renderWithToasts(60_000);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    act(() => vi.advanceTimersByTime(EXIT_ANIMATION_MS));

    expect(screen.queryByText('Project saved.')).not.toBeInTheDocument();
  });

  it('stacks toasts, each with its own timer', () => {
    renderWithToasts(1000);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    act(() => vi.advanceTimersByTime(600));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getAllByText('Project saved.')).toHaveLength(2);

    act(() => vi.advanceTimersByTime(400 + EXIT_ANIMATION_MS));
    expect(screen.getAllByText('Project saved.')).toHaveLength(1);
  });
});
