import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from './firebaseConfig'; // Adjust the path if necessary

const FetchData = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Reference to the path where user data is stored
      const usersRef = ref(database, 'users'); // Adjust path if necessary

      // Fetch user data
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        const userList = [];

        for (const id in data) {
          userList.push({ id, ...data[id] });
        }

        setUsers(userList);
      });
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>User Data</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <p>Name: {user.firstname} {user.lastname}</p>
              <p>Email: {user.email}</p>
              <p>Phone: {user.mobileNum}</p>
              <p>Age: {user.age}</p>
              <p>Gender: {user.gender}</p>
              <p>Address: {user.address}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FetchData;
