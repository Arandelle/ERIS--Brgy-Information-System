import React, { useState } from "react";
import { toast } from "sonner";
import { InputField } from "../../components/ReusableComponents/InputField";
import { auth, app } from "../../services/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  getDatabase,
  push,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "../../helper/CapitalizeFirstLetter";
import { generateUniqueBarangayID } from "../../helper/generateID";
import Modal from "../../components/ReusableComponents/Modal";

const AddUserModal = ({ addUser, setAddUser, label }) => {
  const navigation = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    const url = `https://flowbite.com/docs/images/people/profile-picture-${randomNumber}.jpg`;
    setImageUrl(url);
  }, []);

    const handleAddUser = async (e) => {
      e.preventDefault(); // Prevents the default form submission behavior

      if (!email || !password) {
        toast.error("Please fill in all fields");
        return;
      }

      try {
        const currentUser = auth.currentUser;
        const userId = await generateUniqueBarangayID("user");

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
          timestamp: serverTimestamp(),
          img: imageUrl,
          customId: userId,
          id: user.uid
        };
        const database = getDatabase(app);
        await set(ref(database, `${label}/${user.uid}`), userData);

        await auth.updateCurrentUser(currentUser); // restore the admin
        navigation("/accounts/users");

        const adminId = currentUser.uid;
        const notificationRef = ref(database, `admins/${adminId}/notifications`);
        const newNotification = {
          type: `${label}`,
          message: `You have successfully created an account for ${label}`,
          email: `${user.email}`,
          isSeen: false,
          date: new Date().toISOString(),
          timestamp: serverTimestamp(),
          img: imageUrl,
          userId: user.uid
        };

        await push(notificationRef, newNotification);

        console.log("User created:", user.uid);
        toast(
          <div className="flex items-center justify-center space-x-3 flex-row">
            <img
              className="w-12 h-12 rounded-full border-2 border-primary-500"
              src={imageUrl}
              alt="Notification avatar"
            />
            <div>
              <p className="font-bold">{`${capitalizeFirstLetter(
                label
              )} has been createad`}</p>
              <p>{`${new Date().toLocaleString()}`}</p>
            </div>
          </div>
        );
        setEmail("");
        setPassword("");
        setAddUser(false); // Close the modal after successful submission
      } catch (error) {
        setError(error.message);
        console.error("Error signing up:", error);
        toast.error("Error signing up for user", error.message);
      }
    };

  return (
    <div>
      <Modal
        closeButton={addUser}
        title={`Add new ${label}`}
        children={
          <form onSubmit={handleAddUser}>
            <div className="flex flex-col space-y-4 max-w-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                Ensure that the user information is accurately entered to
                facilitate smooth account creation.
              </p>

              <InputField
                className={"border"}
                type={"email"}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder={"Enter Email"}
              />
              <InputField
                className={"border"}
                type={"password"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder={"Enter Password"}
              />
              <button
                type="submit"
                className="p-2 text-white font-bold bg-primary-600 rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        }
      />
    </div>
  );
};

export default AddUserModal;
