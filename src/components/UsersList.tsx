import '../styles/components/usersList.css';
import UserCard from "./UserCard";
import { useSearchContext } from "../contexts/SearchContext";

const UsersList = () => {
  const { users, loading, error } = useSearchContext();

  if (error) return <p className="error-message">{error}</p>;
  if (users.length === 0 && !loading) return <p className="error-message">Aucun utilisateur trouvé.</p>;

  return (
    <div className="users-list">
      {users.map((user) => {
        return (
          <div key={user.id}>
            <UserCard user={user} />
          </div>
        );
      })}
      {loading && <p className="loading-message">Chargement...</p>}
    </div>
  );
};

export default UsersList;
