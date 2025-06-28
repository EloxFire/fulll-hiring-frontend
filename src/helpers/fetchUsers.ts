import type { User } from "./types/User.ts";

interface FetchUsersResult {
  users: User[];
  nextPageUrl: string | null;
}

export async function fetchUsers(
  url: string,
  signal?: AbortSignal
): Promise<FetchUsersResult> {
  const res = await fetch(url, { signal });

  if (res.status === 403) {
    throw new Error("[403] Limite d'API atteinte.");
  }
  if (!res.ok) {
    throw new Error("Erreur lors de la recherche.");
  }

  const data = await res.json();

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
