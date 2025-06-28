import type { User } from "../helpers/types/User.ts";
import { useEffect, useState, useRef, useCallback } from "react";
import { GITHUB_SEARCH_USER_API_URL } from "../helpers/constants.ts";
import { fetchUsers } from "../helpers/fetchUsers.ts";

interface UseSearchResult {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
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

    // Création d'un AbortController pour annuler une requête si besoin
    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      // Utilisation de la fonction fetchUsers pour récupérer les utilisateurs
      // avec la requête de recherche et l'Abort controller
      // Je demande 100 résultats par page pour limiter le nombre de requêtes
      // mais aussi pour avoir un bon nombre de résultats à afficher.
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

  // La fonction loadMore est utilisée pour charger plus de résultats
  // lorsque l'utilisateur atteint le bas de la liste.

  // Elle utilise un useCallback pour éviter de recréer la fonction à chaque rendu,
  // ce qui est important pour la performance.
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

  // Ici on créée un effet de debounce pour éviter de faire une requête
  // à chaque frappe de l'utilisateur. On attend 500ms après la dernière frappe
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      initialFetch();
    }, 500); // debounce

    // Ici je clear le timeout et j'annule la requête en cours
    // si le composant est démonté ou si la requête change
    return () => {
      clearTimeout(timeoutId);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [query, initialFetch]);

  // On renvoie les données nécessaires pour utiliser ce hook
  return { users, setUsers, loading, error, hasMore, loadMore };
}
