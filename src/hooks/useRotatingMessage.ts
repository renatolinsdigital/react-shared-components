import { useEffect, useState } from 'react';

const FADE_DURATION_MS = 300;

/**
 * Cycles through `messages`, one every `intervalMs`.
 * `isFading` is true for a short moment before each swap so the caller can fade the text out.
 */
export function useRotatingMessage(messages: string[], intervalMs = 10_000) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (messages.length <= 1) return;

    let swapTimer: ReturnType<typeof setTimeout> | undefined;
    const rotationTimer = setInterval(() => {
      setIsFading(true);
      swapTimer = setTimeout(() => {
        setMessageIndex((index) => (index + 1) % messages.length);
        setIsFading(false);
      }, FADE_DURATION_MS);
    }, intervalMs);

    return () => {
      clearInterval(rotationTimer);
      clearTimeout(swapTimer);
    };
  }, [messages.length, intervalMs]);

  return { message: messages[messageIndex % messages.length] ?? '', isFading };
}
