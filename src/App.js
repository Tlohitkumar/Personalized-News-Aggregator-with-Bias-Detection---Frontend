import React, { useEffect, useState } from "react";
import { getUsers } from "./services/userService";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then((res) => {
      setUsers(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Users List</h1>
      {users.map((u) => (
        <p key={u.id}>{u.name} - {u.email}</p>
      ))}
    </div>
  );
}

export default App;