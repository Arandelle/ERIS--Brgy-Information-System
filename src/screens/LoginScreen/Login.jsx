import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import emailjs from "emailjs-com";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { get,ref } from "firebase/database";
import { auth, database } from "../../services/firebaseConfig";
import Modal from "../../components/ReusableComponents/Modal";
import icons from "../../assets/icons/Icons";
import { useFetchSystemData } from "../../hooks/useFetchSystemData";
import { InputStyle } from "../../components/ReusableComponents/InputStyle";
import Spinner from "../../components/ReusableComponents/Spinner";
import ForgetPassword from "./ForgetPassword";
import OtpForm from "./OtpForm";

export default function Login() {
  const navigate = useNavigate();

  const { systemData } = useFetchSystemData();
  const [email, setEmail] = useState("");
  const [emailToMask, setEmailToMask] = useState(""); // use for email display when reset password is sent
  const [emailError, setEmailError] = useState("");
  const [password, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [forgotPass, setForgotPass] = useState(false);
  const [resetPassSent, setResetPassSent] = useState(false);

  const handleLoginError = (error) => {
    switch (error.code) {
      case "auth/invalid-credential":
        toast.error("Login failed: Invalid password.");
        break;
      case "auth/user-not-found":
        toast.error("Login failed: No user found with this email.");
        break;
      case "auth/too-many-requests":
        toast.error(
          "Login failed: Too many unsuccessful login attempts. Please try again later."
        );
        break;
      case "auth/email-already-in-use":
        toast.error("Registration failed: Email is already in use.");
        break;
      case "auth/weak-password":
        toast.error("Registration failed: Password is too weak.");
        break;
      case "auth/invalid-email":
        toast.error("Registration failed: Invalid email format.");
        break;
      default:
        toast.error(`An error occurred: ${error.message}`);
        break;
    }
  };

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

      if (user) {
        // check the systemData, if isOtpEnabled is true proceed to send otp else login
        if(systemData?.isOtpEnabled){
        // Generate OTP and send it to the user's email
        await signOut(auth); // sign out the user before sending the otp
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

        // Save the generated OTP for verification
        setGeneratedOtp(otpCode.toString());
        setOtpSent(true);
        setEmailToMask(maskedEmail(email));
      } else {
        // if isOtpEnable is false if will proceed here
        toast.success("Login successful");
        navigate("/dashboard");
        setLoading(false);
      }
      }
      setLoading(false);
    } catch (error) {
      handleLoginError(error);
      setLoading(false);
      setEmailToMask("");
      setResetPassSent(false);
    }
  };
   
  // verify the otp sent to the email
  const handleVerify = async (event) => {
    event.preventDefault();
    if (otpInput === "") {
      toast.error("Please enter the OTP");
      return;
    }

    if (otpInput === generatedOtp) {
      setLoading(true);
      try {
        // OTP verified, proceed with Firebase login
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredentials.user;

        // Check if the user has admin privileges
        const adminRef = ref(database, `admins/${user.uid}`);
        const adminSnapshot = await get(adminRef);
        if (adminSnapshot.exists()) {
          toast.success("Login successful");
          navigate("/dashboard");
          setLoading(false);
        } else {
          toast.error("You do not have admin privileges");
          await auth.signOut();
          setLoading(false);
        }
      } catch (error) {
        toast.error("Login failed: " + error.message);
        setLoading(false);
      }
    } else {
      toast.error("Incorrect OTP, please try again");
      setLoading(false);
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
        {!otpSent && (
          <div
          className={`w-full max-w-md`}
        >
          <form action="" onSubmit={handleSubmitWithOtp} className={`space-y-4`}>
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
        )}
              {/*Input for verfication  */}
      {otpSent && (
        <OtpForm
          handleVerify={handleVerify}
          emailToMask={emailToMask}
          setOtpInput={setOtpInput}
          otpInput={otpInput}
        />
      )}
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
