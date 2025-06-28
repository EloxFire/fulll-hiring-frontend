import type {User} from "../helpers/types/User.ts";
import {createContext, useContext, useEffect, useState} from "react";
import {useSearch} from "../hooks/useSearch.tsx";

interface SearchContextType {
  query: string;
  setQuery: (value: string) => void;
  users: User[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;

  selectedUserIds: Set<number>;
  toggleUserSelection: (id: number) => void;
  selectAllUsers: () => void;
  clearSelection: () => void;
  duplicateSelectedUsers: () => void;
  deleteSelectedUsers: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState<string>("");
  const { users, setUsers, loading, error, hasMore, loadMore } = useSearch(query);

  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    setSelectedUserIds(new Set());
  }, [query]);

  const toggleUserSelection = (id: number) => {
    setSelectedUserIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAllUsers = () => {
    setSelectedUserIds(new Set(users.map(user => user.id)));
  };

  const clearSelection = () => {
    setSelectedUserIds(new Set());
  };

  const duplicateSelectedUsers = () => {
    const selectedUsers = users.filter(user => selectedUserIds.has(user.id));
    const duplicatedUsers = selectedUsers.map(user => ({
      ...user,
      id: 1111 + user.id, // ID unique fake
    }));
    // Ajoute les duplicata à la liste
    setUsers(prev => [...prev, ...duplicatedUsers]);
    clearSelection();
  };

  const deleteSelectedUsers = () => {
    setUsers(prev => prev.filter((user: User) => !selectedUserIds.has(user.id)));
    clearSelection();
  };

  return (
    <SearchContext.Provider value={{
      query, setQuery, users, loading, error, hasMore, loadMore,
      selectedUserIds, toggleUserSelection, selectAllUsers, clearSelection,
      duplicateSelectedUsers, deleteSelectedUsers
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};