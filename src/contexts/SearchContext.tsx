import type {User} from "../helpers/types/User.ts";
import {createContext, useContext, useState} from "react";
import {useSearch} from "../hooks/useSearch.tsx";

interface SearchContextType {
  query: string;
  setQuery: (value: string) => void;
  users: User[];
  loading: boolean;
  error: string | null;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState<string>("");
  const { users, loading, error } = useSearch(query);

  return (
    <SearchContext.Provider value={{ query, setQuery, users, loading, error }}>
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