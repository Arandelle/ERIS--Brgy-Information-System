import React, { useState,useEffect } from "react";
import { toast } from "sonner";
import { InputField } from "../../components/ReusableComponents/InputField";
import { auth, database } from "../../services/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import { useNavigate } from "react-router-dom";
import { generateUniqueBarangayID } from "../../helper/generateID";
import Modal from "../../components/ReusableComponents/Modal";
import useSendNotification from "../../hooks/useSendNotification";
import { capitalizeFirstLetter } from "../../helper/CapitalizeFirstLetter";

const AddUserModal = ({ addUser, setAddUser, label }) => {
  const navigation = useNavigate();
  const { sendNotification } = useSendNotification(); // use the sendNotification hook
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    imageUrl: "",
  });
  const { email, password, imageUrl } = userData; // Destructure the userData object
  const [error, setError] = useState(null);

  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * 5) + 1; // Generate a random number between 1 and 5 ( adding 1 to avoid 0)
    const url = `https://flowbite.com/docs/images/people/profile-picture-${randomNumber}.jpg`;
    setUserData({ ...userData, imageUrl: url });
  }, []);

    const handleAddUser = async (e) => {
      e.preventDefault(); // Prevents the default form submission behavior

      if (!email || !password) {
        toast.error("Please fill in all fields");
        return;
      }

      try {
        const currentUser = auth.currentUser;
        const userId = await generateUniqueBarangayID(`${label}`);

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user; // The user object is returned from the createUserWithEmailAndPassword method
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
        const accountRef = ref(database, `${label}/${user.uid}`); // Create a reference to the user's account
        await set(accountRef, userData); // Save the user's data to the right user account (uid)

        await auth.updateCurrentUser(currentUser); // restore the admin
        navigation("/accounts/users");

        const adminId = currentUser.uid;
        const newNotification = {
          type: `${label}`,
          userId: user.uid
        };

        // send notification to the admin
        await sendNotification("admins", adminId, "createAccount", "admin", newNotification);
        await sendNotification(`${label}`, user.uid, "createAccount","user", newNotification);

        console.log("User created:", user);

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
        
        setUserData({ email: "", password: "", imageUrl: "" });
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
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                value={email}
                placeholder={"Enter Email"}
              />
              <InputField
                className={"border"}
                type={"password"}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
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
