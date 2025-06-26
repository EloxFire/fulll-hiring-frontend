import type {User} from "../helpers/types/User.ts";
import '../styles/components/userCard.css';
import {capitalize} from "../helpers/capitalize.ts";

interface UserCardProps {
  user: User
}

const UserCard = ({user}: UserCardProps) => {
  return (
    <div className={"user-card"}>
      <img src={user.avatar_url} alt={user.login}/>
      <p>{user.id}</p>
      <p>{capitalize(user.login)}</p>

      <button>View profile</button>
    </div>
  );
};

export default UserCard;