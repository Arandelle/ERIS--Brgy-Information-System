import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../components/firebaseConfig";

export const useFetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const usersRef = ref(database, "users");
    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        try {
          const data = snapshot.val();
          const userList = [];
          for (const id in data) {
            userList.push({ id, ...data[id] });
          }
          setUsers(userList);
          setLoading(false);
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { users, loading, error };
};
