import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import emailjs from "emailjs-com";
import OTP from "../assets/images/otp.svg";
import { Tooltip } from "@mui/material";
import { getAuth, signInWithEmailAndPassword,sendPasswordResetEmail } from "firebase/auth";
import { get, getDatabase, ref, } from "firebase/database";
import {auth} from "../services/firebaseConfig"
import Modal from "../components/ReusableComponents/Modal";

export default function Login({ setAuth }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState('');
  const [password, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [forgotPass, setForgotPass] = useState(false);

  const handleForgotPass = () => {
    setForgotPass(!forgotPass);
  };

  const handleShowHidePass = () => {
    setShowPass(!showPass);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Success", "Password reset email sent");
    } catch (error) {
     toast.error(`Error, ${ error.message}`);
    }
  };

  const handleSubmit = () => {
    handlePasswordReset(email);
    setEmail(""); // Clear the input after submission
    setForgotPass(false)
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const auth = getAuth();
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

      //check if an account is admin
      const db = getDatabase();
      const adminRef = ref(db, `admins/${user.uid}`);
      const adminSnapshot = await get(adminRef);
      if (adminSnapshot.exists()) {
        toast.success("Login successful");
        console.log("Login as ", email);
        navigate("/dashboard");
      } else {
        toast.error("You do not have admin priveledges");
        await auth.signOut();
      }
    } catch (error) {
      toast.error("Login failed: " + error.message);
    }
  };

  // const handleSubmitWithOtp = async (event) => {
  //   event.preventDefault();
  //   try {
  //     if (!email || !password) {
  //       toast.error("Please enter both email and password");
  //       return;
  //     }

  //     // Attempt to sign in with Firebase
  //     await signInWithEmailAndPassword(auth, email, password);

  //     // If sign-in is successful, send OTP
  //     const otpCode = Math.floor(100000 + Math.random() * 900000);
  //     const templateParams = {
  //       to_email: email,
  //       otp: otpCode,
  //     };
  //     await emailjs.send(
  //       import.meta.env.VITE_EMAILJS_SERVICE_ID,
  //       import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  //       templateParams,
  //       import.meta.env.VITE_EMAILJS_USER_ID
  //     );
  //     toast.success("OTP sent successfully");
  //     setGeneratedOtp(otpCode.toString());
  //     setOtpSent(true);
  //   } catch (error) {
  //     toast.error("Login failed: " + error.message);
  //   }
  // };

  const handleVerify = () => {
    if (otpInput === "") {
      toast.error("Please enter the OTP");
      return;
    }

    if (otpInput === generatedOtp) {
      setOtpVerified(true);
      setAuth(true);
      toast.success("Login successful");
      navigate("/dashboard");
    } else {
      toast.error("Incorrect OTP, please try again");
    }
  };
  return (
    <>
      <main className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-800 px-4">
        <div
          className={`w-full max-w-md ${
            otpSent && !otpVerified ? "hidden" : "block"
          }`}
        >
          <div className="space-y-1 mb-3">
            <h1 className="text-2xl text-center dark:text-gray-300">
              Welcome Admin! Login your Account.
            </h1>
            {/* <h2 className="dark:text-gray-400">Email: topaguintsarandell@gmail.com</h2>
              <h2 className="dark:text-gray-400 mb-3">Password: 123456</h2> */}
          </div>
          <form action="" onSubmit={handleLogin} className={`space-y-4`}>
            <div className="space-y-2">
              <label htmlFor="email" className="dark:text-gray-400">
                Email:
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <svg
                    class="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 16"
                  >
                    <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                    <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email-address-icon"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  value={email}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="dark:text-gray-400">
                  Password:
                </label>
                <a
                  href="#"
                  className="text-sm underline dark:text-green-400"
                  onClick={handleForgotPass}
                >
                  Forgot Password?
                </a>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  id="password"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Password"
                />
                <div
                  class={`absolute inset-y-0 end-0 flex items-center pe-3.5`}
                  onClick={handleShowHidePass}
                >
                  {!showPass ? (
                    <Tooltip title="Show Password" placement="right" arrow>
                      <p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          class="w-4 h-4 text-gray-500 dark:text-gray-400 cursor-pointer"
                        >
                          <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                          <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                          <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                        </svg>
                      </p>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Hide Password" placement="right" arrow>
                      <p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          class="w-4 h-4 text-gray-500 dark:text-gray-400 cursor-pointer"
                        >
                          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                          <path
                            fill-rule="evenodd"
                            d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </p>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
            <div>
              <button
                className="w-full bg-primary-500 text-white text-bold p-2 rounded"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
        </div>
        {/*Input for verfication  */}
        <div
          className={`flex flex-col ${
            otpSent && !otpVerified ? "block" : "hidden"
          }`}
        >
          <img src={OTP} alt="Image" className="h-60 w-60" />
          <h1>Enter the otp we sent to your email</h1>
          <div className="flex flex-row space-x-2 ">
            <input
              class=""
              type="text"
              placeholder="Enter OTP"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
            />
            <button
              className="w-full bg-primary-500 text-white text-bold py-2 px-4 rounded"
              onClick={handleVerify}
            >
              Verify
            </button>
          </div>
        </div>
      </main>
      {forgotPass && (
        <Modal
          closeButton={handleForgotPass}
          children={
              <div className="rounded-md space-y-4">
                  <p className="font-bold text-lg">Reset Password</p>

                  <div>
                    <p className="font-thin text-[16px]">
                      Enter your email address: 
                    </p>
                  <input
                    className="w-full p-2 border border-gray-400 rounded-md"
                    placeholder="Email"
                    onChange={(e)=>handleEmailChange(e.target.value)}
                    value={email}
                    autoCapitalize="none"
                    type="email"
                  />
                  </div>

                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

                <div className="flex flex-row justify-between w-100">
                  <button
                    className="flex-1 p-2.5 rounded-md items-center bg-gray-400 mr-2.5"
                    onClick={handleForgotPass}
                  >
                    <p className="text-white font-bold">Cancel</p>
                  </button>
                  <button
                    className="flex-1 p-2.5 rounded-md items-center bg-blue-600"
                    onClick={handleSubmit}
                  >
                    <p className="font-bold text-white">Submit</p>
                  </button>
                </div>
              </div>
          }
        />
      )}
    </>
  );
}
