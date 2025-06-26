import type {User} from "../helpers/types/User.ts";
import {useEffect, useState} from "react";
import {GITHUB_SEARCH_USER_API_URL} from "../helpers/constants.ts";

interface UseSearchResult {
  users: User[];
  loading: boolean;
  error: string | null;
}

export function useSearch(query: string): UseSearchResult {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Searching for users:", query);
    if (!query) {
      setUsers([]);
      setError(null);
      return;
    }

    const controller = new AbortController(); // permet d'annuler les appels précédents
    const timeoutId = setTimeout(() => {
      setLoading(true);
      setError(null);

      fetch(`${GITHUB_SEARCH_USER_API_URL}${query}`, {
        signal: controller.signal,
      })
        .then(async (res) => {
          if (res.status === 403) {
            throw new Error("[403] Limite d'API atteinte.");
          }
          if (!res.ok) {
            throw new Error("Erreur lors de la recherche.");
          }

          const data = await res.json();
          setUsers(data.items || []);
          if ((data.items || []).length === 0) {
            setError("Aucun résultat.");
          }
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setError(err.message);
            setUsers([]);
          }
        })
        .finally(() => setLoading(false));
    }, 500); // debounce 500ms

    return () => {
      clearTimeout(timeoutId); // annule debounce si query change rapidement
      controller.abort(); // annule le fetch si la recherche change
    };
  }, [query]);

  return { users, loading, error };
}