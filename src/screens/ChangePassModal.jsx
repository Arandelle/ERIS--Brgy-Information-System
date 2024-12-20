import React, { useEffect, useState } from "react";
import { ProfileModalStyle } from "./ProfileModal";
import { InputField } from "../components/ReusableComponents/InputField";
import { auth } from "../services/firebaseConfig";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { toast } from "sonner";

const ChangePassModal = ({handlePasswordModal}) => {
  const user = auth.currentUser;
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const handleChangePassword = async () => {

    if(!user){
        toast.warning("No user logged in");
        return;
    }
    try{
        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credential);

        if(newPassword === oldPassword){
            toast.warning("New password cannot be same as oldpassword!");
        }else if (newPassword !== reEnterPassword){
            toast.warning("New password do not match");
        } else{
            await updatePassword(user, newPassword);
            toast.success("Successfully changed password");
            handlePasswordModal();
        }
       
    }catch(error){
        if(error.code === "auth/invalid-credential"){
            toast.warning("Old password is incorrect")
        }else {
            toast.error(`${error}`);
        }
    }
  };

  useEffect(() => {
    const completed = oldPassword && newPassword && reEnterPassword;
    setIsComplete(completed);
  }, [oldPassword, newPassword, reEnterPassword]);

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
          className={`${isComplete ? "bg-green-500" : "bg-gray-500"} w-full py-2 text-white text-sm rounded-md`}
          disabled={!isComplete}
          onClick={handleChangePassword}
        >
          Change Password
        </button>
      }
    />
  );
};

export default ChangePassModal;
