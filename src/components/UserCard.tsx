import type { User } from "../helpers/types/User.ts";
import '../styles/components/userCard.css';
import { capitalize } from "../helpers/capitalize.ts";
import { truncate } from "../helpers/truncate.ts";
import { useSearchContext } from "../contexts/SearchContext.tsx";

interface UserCardProps {
  user: User;
}

const UserCard = ({ user }: UserCardProps) => {
  const { selectedUserIds, toggleUserSelection } = useSearchContext();
  const isSelected = selectedUserIds.has(user.id);

  return (
    <div className={`user-card ${isSelected ? 'selected' : ''}`}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => toggleUserSelection(user.id)}
      />
      <img src={user.avatar_url} alt={user.login} />
      <div className={"user-info"}>
        <p>{truncate(user.id.toString())}</p>
        <p>{truncate(capitalize(user.login))}</p>
      </div>
      <a href={user.html_url} target={'_blank'} rel={"noreferrer"}>View profile</a>
    </div>
  );
};

export default UserCard;
