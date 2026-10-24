import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRotatingMessage } from './useRotatingMessage';

const FADE_DURATION_MS = 300;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useRotatingMessage', () => {
  it('fades out, then shows the next message, and wraps around', () => {
    const { result } = renderHook(() => useRotatingMessage(['Open to work', 'Booked'], 1000));
    expect(result.current).toEqual({ message: 'Open to work', isFading: false });

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toEqual({ message: 'Open to work', isFading: true });

    act(() => vi.advanceTimersByTime(FADE_DURATION_MS));
    expect(result.current).toEqual({ message: 'Booked', isFading: false });

    act(() => vi.advanceTimersByTime(1000 + FADE_DURATION_MS));
    expect(result.current.message).toBe('Open to work');
  });

  it('keeps a single message still', () => {
    const { result } = renderHook(() => useRotatingMessage(['Only one'], 1000));

    act(() => vi.advanceTimersByTime(5000));

    expect(result.current).toEqual({ message: 'Only one', isFading: false });
  });

  it('shows the first of a shorter list instead of nothing when the list shrinks', () => {
    const { result, rerender } = renderHook(({ messages }) => useRotatingMessage(messages, 1000), {
      initialProps: { messages: ['one', 'two', 'three'] },
    });
    act(() => vi.advanceTimersByTime(2 * (1000 + FADE_DURATION_MS)));
    expect(result.current.message).toBe('three');

    rerender({ messages: ['one', 'two'] });

    expect(result.current.message).toBe('one');
  });
});
