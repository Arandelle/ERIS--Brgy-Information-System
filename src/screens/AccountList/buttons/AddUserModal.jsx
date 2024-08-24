import React, { useState } from "react";
import { toast } from "sonner";
import InputReusable from "../../../components/ReusableComponents/InputReusable";
import { auth, app } from "../../../services/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { getDatabase, push, ref, serverTimestamp, set } from "firebase/database";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddUserModal = ({ addUser, setAddUser, label }) => {
  const navigation = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState(null);

  useEffect(()=>{
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    const url = `https://flowbite.com/docs/images/people/profile-picture-${randomNumber}.jpg`
    setImageUrl(url);
  }, [])

  const handleAddUser = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const currentUser = auth.currentUser;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await sendEmailVerification(user);

      const userData = {
        email: user.email,
        profileComplete: false,
        createdAt: new Date().toISOString(),
        img: imageUrl
      };
      const database = getDatabase(app);
      await set(ref(database, `${label}/${user.uid}`), userData);

      await auth.updateCurrentUser(currentUser); // restore the admin 
      navigation("/accounts/users")
      
      const adminId = currentUser.uid
      const notificationRef = ref(database, `admins/${adminId}/notifications`);
      const newNotification = {
        message: `You have successfully created an account for ${label}`,
        email: `${user.email}`,
        isSeen: false,
        date: new Date().toISOString(),
        timestamp: serverTimestamp(),
        img: imageUrl
      };

      await push(notificationRef, newNotification);

      console.log("User created:", user.uid);
      toast.success("Success", "Please check your email for verification");
      setEmail("");
      setPassword("");
      setAddUser(false); // Close the modal after successful submission
    } catch (error) {
      setError(error.message);
      console.error("Error signing up:", error);
      toast.error("Error signing up", error.message);
    }
  };

  return (
    <div>
      {addUser && (
        <form
          className="flex items-center justify-center fixed inset-0 z-50"
          onSubmit={handleAddUser}
        >
          <div
            className="absolute h-full w-full bg-gray-600 bg-opacity-50"
            onClick={() => setAddUser(false)}
          ></div>
          <div className="relative p-4 bg-white rounded-sm shadow-md">
            <button
              className="absolute top-2 right-2"
              onClick={() => setAddUser(false)}
            >
              Close
            </button>
            <div className="flex flex-col space-y-10">
              
             <div className="w-full space-y-4">
             <h2 className="text-center text-lg font-extrabold text-gray-700">Create new {`${label}`}</h2>
                <InputReusable
                  className={"border"}
                  type={"email"}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder={"Enter Email"}
                />
                <InputReusable
                  className={"border"}
                  type={"password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder={"Enter Password"}
                />
             </div>

              <button className="p-2 text-white font-bold bg-primary-600 rounded-md">
                Submit
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddUserModal;
