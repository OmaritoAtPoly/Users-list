import type { User } from "../types";

export interface UserListProps {
  users: User[];
  onSelect: (user: User) => void;
  selectedId: number | null;
}

export const UserList = ({ users, onSelect, selectedId }: UserListProps) => {
  if (users.length === 0) {
    return <p>No users found.</p>;
  }

  const handleOnUserSelect = (user: User) => () => {
    onSelect(user);
  };

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <button
            type="button"
            onClick={handleOnUserSelect(user)}
            aria-pressed={selectedId === user.id}
          >
            {user.name}
          </button>
          <p>{user.email}</p>
          <p>{user.company.name}</p>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
