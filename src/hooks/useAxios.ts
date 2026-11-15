import { useCallback, useEffect, useState } from "react";
import { http, type RequestState } from "./custom.type";
import { toMessage } from "./utils";

export const useGet = <T>(url: string) => {
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!url) {
        if (active) setState({ data: null, loading: false, error: null });
        return;
      }
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const { data } = await http.get<T>(url);
        if (active) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (active) {
          setState({ data: null, loading: false, error: toMessage(error) });
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [url]);

  const reload = useCallback(async () => {
    if (!url) return;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { data } = await http.get<T>(url);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: toMessage(error) });
    }
  }, [url]);

  return { ...state, reload };
};

export const usePost = <T>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const post = useCallback(
    async (url: string, body: unknown): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await http.post<T>(url, body);
        return data;
      } catch (err) {
        setError(toMessage(err));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { post, loading, error };
};
