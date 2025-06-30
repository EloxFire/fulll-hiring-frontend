import React from 'react';
import {describe, it, expect, vi} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type {User} from "../types/User";
import ActionBar from "../components/ActionBar";
import {SearchContext} from "../contexts/SearchContext";

const mockUsers: User[] = [
  { id: 1, login: 'octocat', avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4', html_url: 'https://github.com/octocat' }
];

const MockSearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedUserIds, setSelectedUserIds] = React.useState<Set<number>>(new Set());

  const selectAllUsers = () => setSelectedUserIds(new Set(mockUsers.map(user => user.id)));
  const clearSelection = () => setSelectedUserIds(new Set());
  const duplicateSelectedUsers = () => {};
  const deleteSelectedUsers = () => {};

  return (
    <SearchContext.Provider
      value={{
        query: '',
        setQuery: () => {},
        users: mockUsers,
        loading: false,
        error: null,
        hasMore: false,
        loadMore: () => {},
        selectedUserIds,
        selectAllUsers,
        clearSelection,
        duplicateSelectedUsers,
        deleteSelectedUsers,
        toggleUserSelection: vi.fn()
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

describe('TEST ACTION BAR', () => {
  it('Teste le rendu et le comportement "disabled" par défaut des boutons', () => {
    render(
      <MockSearchProvider>
        <ActionBar />
      </MockSearchProvider>
    );

    expect(screen.getByText(/0 sélectionné/)).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('Passe les boutons en "actifs" quand une carte utilisateur est sélectionnée + comportement général de l\'action bar', () => {
    render(
      <MockSearchProvider>
        <ActionBar />
      </MockSearchProvider>
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Vérifie que le compteur a changé
    expect(screen.getByText(/1 sélectionné/)).toBeInTheDocument();

    // Vérifie que les boutons sont activés
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });
});
