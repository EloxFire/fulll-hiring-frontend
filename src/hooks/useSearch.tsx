import type { User } from "../helpers/types/User.ts";
import { useEffect, useState, useRef, useCallback } from "react";
import { GITHUB_SEARCH_USER_API_URL } from "../helpers/constants.ts";
import { fetchUsers } from "../helpers/fetchUsers.ts";

interface UseSearchResult {
  users: User[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
}

export function useSearch(query: string): UseSearchResult {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  const initialFetch = useCallback(async () => {
    if (!query) {
      setUsers([]);
      setError(null);
      setHasMore(false);
      setNextPageUrl(null);
      return;
    }

    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const { users: newUsers, nextPageUrl } = await fetchUsers(
        `${GITHUB_SEARCH_USER_API_URL}${query}&per_page=100&page=1`,
        controllerRef.current.signal
      );

      setUsers(newUsers);
      setHasMore(nextPageUrl !== null);
      setNextPageUrl(nextPageUrl);

      if (newUsers.length === 0) {
        setError("Aucun résultat.");
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message);
        setUsers([]);
      }
    } finally {
      setLoading(false);
    }
  }, [query]);

  const loadMore = useCallback(async () => {
    if (!nextPageUrl || loading) return;

    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const { users: newUsers, nextPageUrl: newNextPageUrl } = await fetchUsers(
        nextPageUrl,
        controllerRef.current.signal
      );

      setUsers((prev) => [...prev, ...newUsers]);
      setHasMore(newNextPageUrl !== null);
      setNextPageUrl(newNextPageUrl);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [nextPageUrl, loading]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      initialFetch();
    }, 500); // debounce

    return () => {
      clearTimeout(timeoutId);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [query, initialFetch]);

  return { users, loading, error, hasMore, loadMore };
}
