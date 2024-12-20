import React, { useState } from "react";
import { ProfileModalStyle } from "./ProfileModal";
import { InputField } from "../components/ReusableComponents/InputField";
import { auth } from "../services/firebaseConfig";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { toast } from "sonner";

const ChangePassModal = () => {
  const user = auth.currentUser;
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");

  const handleChangePassword = () => {
    if (user) {
      const newPass = newPassword;

      const credential = EmailAuthProvider.credential(user.email, oldPassword);
    
      reauthenticateWithCredential(user, credential).then(() => {
        if(newPassword === reEnterPassword){
        updatePassword(user, newPass)
        .then(() => {
          toast.success("Successfully update the password!");
        })
        .catch((error) => {
          toast.error(`Error updating password ${error}`);
        });
        } else{
            toast.error("New password do not match");
        }
      }).catch((error) => {
        toast.error(`Error re-authenticating: ${error.message}`)
      })
      
    } else {
      toast.error("No user is logged in");
    }
  };
  return (
    <ProfileModalStyle
      inputsArea={
        <>
          <InputField
            type="password"
            placeholder={"Enter old password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <InputField
            type="password"
            placeholder={"Enter new password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <InputField
            type="password"
            placeholder={"Re-enter your new password"}
            value={reEnterPassword}
            onChange={(e) => setReEnterPassword(e.target.value)}
          />
        </>
      }
      submitButton={
        <button
          className="bg-green-500 w-full py-2 text-white text-sm rounded-md"
          onClick={handleChangePassword}
        >
          Change Password
        </button>
      }
    />
  );
};

export default ChangePassModal;
