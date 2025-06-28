import type {User} from "../helpers/types/User.ts";
import '../styles/components/userCard.css';
import {capitalize} from "../helpers/capitalize.ts";
import {truncate} from "../helpers/truncate.ts";

interface UserCardProps {
  user: User
}

const UserCard = ({user}: UserCardProps) => {
  return (
    <div className={"user-card"}>
      <img src={user.avatar_url} alt={user.login}/>
      <div className={"user-info"}>
        <p>{user.id}</p>
        <p>{truncate(capitalize(user.login))}</p>
      </div>
      <a>View profile</a>
    </div>
  );
};

export default UserCard;