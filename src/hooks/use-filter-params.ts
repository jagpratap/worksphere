import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

/**
 * Generic hook that syncs filter state to URL search params.
 *
 * - Reads current values from the URL, falling back to provided defaults.
 * - Omits params from the URL when they match the default (keeps URLs clean).
 * - `set` updates a single param; `reset` clears all filter params.
 */
export function useFilterParams<T extends Record<string, string>>(defaults: T) {
  const [searchParams, setSearchParams] = useSearchParams();

  const values = useMemo(() => {
    const result = {} as { [K in keyof T]: string };
    for (const key in defaults) {
      result[key] = searchParams.get(key) ?? defaults[key];
    }
    return result;
  }, [searchParams, defaults]);

  const set = useCallback(
    <K extends keyof T & string>(key: K, value: string) => {
      setSearchParams((prev) => {
        if (value === defaults[key])
          prev.delete(key);
        else
          prev.set(key, value);
        return prev;
      });
    },
    [setSearchParams, defaults],
  );

  const reset = useCallback(() => {
    setSearchParams((prev) => {
      for (const key in defaults) {
        prev.delete(key);
      }
      return prev;
    });
  }, [setSearchParams, defaults]);

  return { values, set, reset };
}
