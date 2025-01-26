import React from "react";
import { InputStyle } from "../../components/ReusableComponents/InputStyle";

const ForgetPassword = ({
  email,
  handleEmailChange,
  emailError,
  handleSubmitResetPass,
}) => {
  return (
    <form className="space-y-4 sm:w-auto md:min-w-[32rem] max-w-lg" onSubmit={handleSubmitResetPass}>
      <div className="space-y-2">
      <p className="text-sm text-gray-600 dark:text-gray-300 italic">
          Enter your email address below, and we'll send you a link to reset your password. This link will allow you to create a new password and regain access to your account.
        </p>
        <p className="text-sm text-gray-800">Enter your email address:</p>
        <InputStyle
          iconName={"email"}
          type={"email"}
          placeholder={"Enter your email"}
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
        />
      </div>

      {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

      <div className="place-self-end">
        <button
          className="bg-blue-800 text-sm p-2 rounded-md text-white shadow-lg"
          type="submit"
        >
          Send Reset Link
        </button>
      </div>
    </form>
  );
};

export default ForgetPassword;
