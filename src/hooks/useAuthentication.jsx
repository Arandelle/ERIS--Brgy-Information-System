import React, {useEffect, useState} from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";


export const useAuthentication =() => {

    const [isAuthenticated, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
         setAuth(!!user)
        });
    
        // Cleanup subscription on unmount
        return () => unsubscribe();
      }, []);

      
  return {isAuthenticated, setAuth};
}
