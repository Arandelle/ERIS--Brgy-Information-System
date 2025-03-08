import { useEffect, useState } from "react";
import soundFile from "../../assets/sound/emergencySound.mp3";
import { useLocation } from "react-router-dom";

const NotificationSound = () => {
  const location = useLocation();
  const [notifications, setNotifications] = useState([]); // Example notifications
  const sound = new Audio(soundFile); // Place this file in the 'public' folder

  useEffect(() => {
    if(location.pathname === "/maps"){
      sound.play();
    }
  },[location.pathname]);

  return (
    <div className="bg-white p-2">
      <h2>Notifications</h2>
      <button onClick={() => sound.play()}>play</button>
    </div>
  );
};


export default NotificationSound;
