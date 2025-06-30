import type { User } from "../../types/User.ts";

interface FetchUsersResult {
  users: User[];
  nextPageUrl: string | null;
}

// Fonction pour récupérer les utilisateurs depuis l'API GitHub
export async function fetchUsers(
  url: string,
  signal?: AbortSignal
): Promise<FetchUsersResult> {
  const res = await fetch(url, { signal });

  if (res.status === 403 || res.status === 429) {
    // Je place ici un limite d'API atteinte aussi sur les erreurs 403 car Github peut renvoyer ce type
    // d'erreur si le nombre de requêtes est trop élevé.
    // https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28#exceeding-the-rate-limit
    throw new Error("Erreur : Limite d'API atteinte.");
  }
  if (!res.ok) {
    throw new Error("Erreur lors de la recherche.");
  }

  const data = await res.json();

  // Gestion de la pagination avec le header Link
  // https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2022-11-28#using-link-headers
  let nextPageUrl: string | null = null;
  const linkHeader = res.headers.get("Link");

  if (linkHeader) {
    const links = linkHeader.split(", ");
    const nextLink = links.find((link) => link.includes('rel="next"'));
    if (nextLink) {
      const match = nextLink.match(/<([^>]+)>/);
      if (match) {
        nextPageUrl = match[1];
      }
    }
  }

  return {
    users: data.items || [],
    nextPageUrl,
  };
}
