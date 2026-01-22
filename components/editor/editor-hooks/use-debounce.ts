import { useEffect, useMemo } from "react";
import { debounce } from "lodash";

export function useDebounce<T extends (...args: never[]) => void>(
  fn: T,
  ms: number,
  maxWait?: number,
) {
  const debounced = useMemo(
    () => debounce(fn, ms, { maxWait }),
    [fn, ms, maxWait],
  );

  useEffect(() => {
    return () => {
      debounced.cancel();
    };
  }, [debounced]);

  return debounced;
}
