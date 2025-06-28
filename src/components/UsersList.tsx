import '../styles/components/usersList.css';
import UserCard from "./UserCard";
import { useSearchContext } from "../contexts/SearchContext";

const UsersList = () => {
  const { users, loading, error, hasMore, loadMore } = useSearchContext();

  if (error) return <p className="error-message">{error}</p>;
  if (users.length === 0 && !loading) return <p className="error-message">Aucun utilisateur trouvé.</p>;

  return (
    <div className="users-list">
      {users.map((user) => (
        <div key={user.id}>
          <UserCard user={user} />
        </div>
      ))}
      <div>
        {loading && <p className="loading-message">Chargement...</p>}
        {!loading && hasMore && (
          <button className="load-more-button" onClick={loadMore}>
            Voir plus
          </button>
        )}

        {!hasMore && users.length > 0 && (
          <p className="end-message">Vous avez atteint la fin des résultats.</p>
        )}
      </div>
    </div>
  );
};

export default UsersList;
