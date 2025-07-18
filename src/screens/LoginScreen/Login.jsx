import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import emailjs from "emailjs-com";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { auth, database } from "../../services/firebaseConfig";
import Modal from "../../components/ReusableComponents/Modal";
import icons from "../../assets/icons/Icons";
import { useFetchSystemData } from "../../hooks/useFetchSystemData";
import { InputStyle } from "../../components/ReusableComponents/InputStyle";
import Spinner from "../../components/ReusableComponents/Spinner";
import ForgetPassword from "./ForgetPassword";
import handleErrorMessage from "../../helper/handleErrorMessage";
import logAuditTrail from "../../hooks/useAuditTrail";

export default function Login() {
  const navigate = useNavigate();

  const { systemData } = useFetchSystemData();
  const [email, setEmail] = useState("");
  const [emailToMask, setEmailToMask] = useState(""); // use for email display when reset password is sent
  const [emailError, setEmailError] = useState("");
  const [password, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPass, setForgotPass] = useState(false);
  const [resetPassSent, setResetPassSent] = useState(false);

  const handleForgotPass = () => {
    setForgotPass(!forgotPass);
  };

  const handleEmailChange = (value) => {
    setEmail(value);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordReset = async (email) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Success: Password reset email sent");
      setLoading(false);
      setResetPassSent(true);
    } catch (error) {
      toast.error(`Error, ${error.message}`);
      setLoading(false);
    }
  };

  const handleSubmitResetPass = () => {
    handlePasswordReset(email);
    setEmailToMask(maskedEmail(email)); // save the email for display
    setEmail(""); // reset the email input
    setForgotPass(false);
  };

  // Check if OTP is being sent when the component mounts
  useEffect(() => {
    const isSendingOTP = sessionStorage.getItem('otpSending');
    if(isSendingOTP){
      setLoading(true);
    }
  }, []);

  const handleSubmitWithOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      // Sign in with email and password
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user; // Get the user object from the credentials

      if (!user.emailVerified) {
        await signOut(auth);
        toast.error("Please verify your email first");
        navigate("/dashboard");
        return;
      }

      // first fetch directly the admin using the uid to get the object and check if it's isLocked
      const adminRef = ref(database, `admins/${user.uid}`);
      const snapshot = await get(adminRef);

      if (snapshot.exists()) {
        const adminData = snapshot.val();
        if (adminData.isLocked) {
          await signOut(auth); // Logout
          toast.error("Your account is locked.");
          setLoading(false);
          return;
        }
      } else {
        toast.error("Admin data not found.");
        await signOut(auth);
        setLoading(false);
        return;
      }

      // proceed if not locked
      // check the systemData, if isOtpEnabled is true proceed to send otp else login
      if (systemData?.isOtpEnabled) {
        // Generate OTP and send it to the user's email
        await signOut(auth); // sign out the user before sending the otp
        toast("Sending OTP to your email...");
        sessionStorage.setItem('otpSending', 'true'); // Set a flag to indicate OTP is being sent
        const otpCode = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
        const templateParams = {
          to_email: email,
          otp: otpCode,
        };

        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          templateParams,
          import.meta.env.VITE_EMAILJS_USER_ID
        );
        toast.success("OTP sent successfully");

        // Store the OTP and email in state for verification
        navigate("/verify-otp", {
          state:{
            email: email,
            password: password,
            otp: otpCode.toString(),
            emailToMask: maskedEmail(email),
          }
        });

        sessionStorage.removeItem('otpSending'); // Clear the OTP sending flag
        
      } else {
        // if isOtpEnable is false if will proceed here
        toast.success("Login successful");
        navigate("/dashboard");
        setLoading(false);
        await logAuditTrail("Logged in");
      }

    } catch (error) {
      handleErrorMessage(error);
      setLoading(false);
      setEmailToMask("");
      setResetPassSent(false);
    }
  };

  // mask the email address for security
  const maskedEmail = (email) => {
    const [name, domain] = email.split("@"); // split the email into name and domain between @

    if (name.length <= 2) return email; // if the name is less than 2 characters. return the email as usual
    const maskedName = name.slice(0, 2) + "****"; // mask the name with 2 characters and ****
    return maskedName + "@" + domain; // return the masked email
  };

  if (loading) {
    return (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <Spinner loading={loading} />
        </div>
      </>
    );
  }

  return (
    <>
      <main
        className={`relative flex h-screen w-full items-center justify-center  px-4`}
      >
        <div
          className={`absolute inset-0 h-full w-full opacity-30 bg-center bg-no-repeat z-[-1]`}
          style={{
            backgroundImage: `url(${systemData?.imageUrl})`,
          }}
        ></div>
          <div className={`w-full max-w-md`}>
            <form
              action=""
              onSubmit={handleSubmitWithOtp}
              className={`space-y-4`}
            >
              <div className="space-y-2">
                <h1 className="text-2xl text-center dark:text-gray-300">
                  Welcome Admin! Login your Account.
                </h1>

                {resetPassSent && (
                  <div className="place-self-center m-4">
                    <p className="p-2 text-red-600 dark:text-gray-300 whitespace-nowrap">
                      We have sent a reset password link to your email{" "}
                      <span className="italic font-bold">{emailToMask}</span>
                    </p>
                  </div>
                )}
                <InputStyle
                  label={"Email: "}
                  iconName={"email"}
                  type={"email"}
                  placeholder={"admin@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="dark:text-gray-400">
                    Password:
                  </label>
                  <a
                    href="#"
                    className="text-sm underline dark:text-gray-400"
                    onClick={handleForgotPass}
                  >
                    Forgot Password?
                  </a>
                </div>
                <InputStyle
                  type={"password"}
                  iconName={"lock"}
                  placeholder={"Enter your password"}
                  value={password}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
              <div>
                <button
                  className="flex flex-row space-x-2 items-center justify-center w-full bg-blue-800 dark:bg-blue-500 text-white dark:text-gray-100 text-bold p-2 rounded shadow-lg"
                  type="submit"
                >
                  <icons.login fontSize="small" />
                  <p>Login</p>
                </button>
              </div>
            </form>
          </div>
      </main>
      {forgotPass && (
        <Modal
          closeButton={handleForgotPass}
          title={"Reset Password"}
          children={
            <ForgetPassword
              email={email}
              handleEmailChange={handleEmailChange}
              emailError={emailError}
              handleSubmitResetPass={handleSubmitResetPass}
            />
          }
        />
      )}
    </>
  );
}
