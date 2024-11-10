import { useEffect, useRef, useCallback } from 'react';

export default function useComponentClicked(f: (i: boolean) => void) {
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (ref.current) {
        f(ref.current.contains(target));
      }
    },
    [ref, f]
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [handleClickOutside]);

  return ref;
}
