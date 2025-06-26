import {useSearchContext} from "../contexts/SearchContext.tsx";
import '../styles/components/searchInput.css'

const SearchInput = () => {
  const { query, setQuery } = useSearchContext();

  return (
    <input
      className="search-input"
      type="text"
      placeholder="Rechercher un utilisateur"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

export default SearchInput;