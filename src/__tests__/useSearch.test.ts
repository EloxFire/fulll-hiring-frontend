import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type {User} from "../types/User";
import {useSearch} from "../hooks/useSearch";
import * as fetchUsersModule from '../helpers/api/fetchUsers';

const mockUsers: User[] = [
  { id: 1, login: 'octocat', avatar_url: '', html_url: '' },
];

describe('TEST USESEARCH', () => {
  const fetchUsersSpy = vi.spyOn(fetchUsersModule, 'fetchUsers');

  beforeEach(() => {
    vi.useFakeTimers();
    fetchUsersSpy.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Récupère et met a jour la liste utilisateur lors d\'une requete', async () => {
    fetchUsersSpy.mockResolvedValue({
      users: mockUsers,
      nextPageUrl: null,
    });

    const { result, rerender } = renderHook(({ query }) => useSearch(query), {
      initialProps: { query: '' },
    });

    await act(async () => {
      rerender({ query: 'octocat' });
      vi.advanceTimersByTime(500); // Simule le debounce
      await Promise.resolve();
    });


    expect(fetchUsersSpy).toHaveBeenCalled();
    expect(result.current.users).toEqual(mockUsers);

    // flush final pour s'assurer que tout est résolu
    await act(async () => {});
  });
});

