import { useEffect, useState } from 'react';

export default function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched users:', data);
        setUsers(data);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  return (
    <div>
      <h1>Daftar User</h1>
      <ul>
        {users.map((user) => (
          <li key={user.UserID}>
            <strong>{user.Username}</strong> - {user.Email} ({user.Role})
          </li>
        ))}
      </ul>
    </div>
  );
}
