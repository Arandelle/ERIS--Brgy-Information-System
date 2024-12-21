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
import {InputField} from "../components/ReusableComponents/InputField";
import icons from "../assets/icons/Icons";
import { useFetchSystemData } from "../hooks/useFetchSystemData";

export default function Login({ setAuth }) {
  const navigate = useNavigate();

  const {systemData} = useFetchSystemData();
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
                <div class="absolute text-gray-500 inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <icons.email fontSize="small"/>
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
                <div class="absolute text-gray-500 inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <icons.lock fontSize="small"/>
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
                     <div className="text-gray-500 cursor-pointer"><icons.closeEye fontSize="small"/></div>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Hide Password" placement="right" arrow>
                      <div className="text-gray-500 cursor-pointer">
                        <icons.view fontSize="small"/>
                      </div>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
            <div>
              <button
                className="flex flex-row space-x-2 items-center justify-center w-full bg-primary-500 text-white text-bold p-2 rounded"
                type="submit"
              > 
               <icons.login fontSize="small" />
                <p>Login</p>
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
          title={"Reset Password"}
          children={
              <div className="space-y-4 sm:w-auto md:min-w-[32rem]">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-800">
                      Enter your email address: 
                    </p>
                    <InputField
                      type="email"
                      placeholder={"Enter you email"}
                      value={email}
                      onChange={(e)=>handleEmailChange(e.target.value)}
                    />
                  </div>

                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

                <div className="flex flex-row space-x-2 place-content-end">
                  <button
                    className="border border-gray-400 px-4 text-sm p-2 rounded-sm text-gray-800"
                    onClick={handleForgotPass}
                  >
                Cancel
                  </button>
                  <button
                    className="bg-blue-500 text-sm p-2 rounded-sm text-white shadow-md"
                    onClick={handleSubmit}
                  >
                  Send reset password
                  </button>
                </div>
              </div>
          }
        />
      )}
    </>
  );
}
