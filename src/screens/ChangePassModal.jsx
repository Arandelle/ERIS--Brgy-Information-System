import React from "react";
import { ProfileModalStyle } from "./ProfileModal";
import { InputField } from "../components/ReusableComponents/InputField";

const ChangePassModal = () => {
  return (
    <ProfileModalStyle
      inputsArea={
        <>
          <InputField
            // value={adminData.fullname}
            type="password"
            placeholder={"Enter old password"}
          />
          <InputField type="password" placeholder={"Enter new password"} />
          <InputField
            type="password"
            placeholder={"Re-enter your new password"}
          />
        </>
      }
      submitButton={
        <button
          className="bg-green-500 w-full py-2 text-white text-sm rounded-md"
        >
          Change Password
        </button>
      }
    />
  );
};

export default ChangePassModal;
