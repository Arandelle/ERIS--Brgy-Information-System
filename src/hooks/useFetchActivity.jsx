import { useState, useEffect } from "react"
import { database } from "../services/firebaseConfig";
import { ref, onValue } from "firebase/database";

const useFetchActivity = (datatype) => {
    const [activity, setActivity] = useState([]);

    useEffect(() => {
        const announcementRef = ref(database, `${datatype}`);
        const unsubscribe = onValue(announcementRef, (snapshot) => {
          try {
            const announcementData = snapshot.val();
            const announcementList = Object.keys(announcementData).map((key) => ({
              id: key,
              ...announcementData[key],
            }));
            setActivity(announcementList);
          } catch (error) {
            console.log("Error: ", error);
          }
        });
    
        return () => unsubscribe();
      }, []);
    

  return {activity}
}

export default useFetchActivity
