import { useLocation, useNavigate } from "react-router-dom";
import OTP from "../../assets/images/otp.svg";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { get, ref } from "firebase/database";
import { auth,database } from "../../services/firebaseConfig";
import logAuditTrail from "../../hooks/useAuditTrail";
import Spinner from "../../components/ReusableComponents/Spinner";
import icons from "../../assets/icons/Icons";
import { InputStyle } from "../../components/ReusableComponents/InputStyle";

const OtpForm = () => {

  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract email, password, otp, and emailToMask from location state
  // This is set when the user logs in and OTP is required
  const {email, password, otp, emailToMask} = location.state || {};

  const [otpInput, setOtpInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

   // verify the otp sent to the email
  const handleVerify = async (event) => {
    event.preventDefault();
    
    if (otpInput === "") {
      toast.error("Please enter the OTP");
      return;
    }

    if (otpInput.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    if (!location.state) {
      toast.error("No OTP data found. Please login again.");
      navigate('/');
      return;
    }

    if (otpInput === otp) {
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
        const adminRef = ref(database, `admins/${user?.uid}`);
        const adminSnapshot = await get(adminRef);
        
        if (adminSnapshot.exists()) {
          
          toast.success("Login successful");
          navigate("/dashboard");
          await logAuditTrail("Logged in");
        } else {
          toast.error("You do not have admin privileges");
          await auth.signOut();
          navigate('/');
        }
      } catch (error) {
        toast.error("Login failed: " + error.message);
        navigate('/');
      } finally {
        setLoading(false);
      }
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= maxAttempts) {
        toast.error("Too many incorrect attempts. Please login again.");
        navigate('/');
      } else {
        toast.error(`Incorrect OTP. ${maxAttempts - newAttempts} attempts remaining.`);
        setOtpInput(""); // Clear input on wrong attempt
      }
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtpInput(value);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
        <Spinner loading={loading} />
      </div>
    );
  }

  if (!location.state) {
    return null; // Will redirect in useEffect
  }

  return (
  <main className="flex h-screen w-full items-center justify-center px-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl text-center dark:text-gray-300">
              Enter Verification Code
            </h1>
            <p className="text-center text-sm dark:text-gray-400">
              We've sent a 6-digit code to{" "}
              <span className="font-semibold">{emailToMask}</span>
            </p>
            {attempts > 0 && (
              <p className="text-center text-xs text-yellow-600 dark:text-yellow-400">
                {maxAttempts - attempts} attempts remaining
              </p>
            )}
          </div>

          <div className="space-y-2">
            <InputStyle
              label="Verification Code:"
              type="text"
              placeholder="Enter 6-digit code"
              value={otpInput}
              onChange={handleInputChange}
              maxLength={6}
              autoComplete="one-time-code"
              inputMode="numeric"
            />
          </div>

          <div className="space-y-2">
            <button
              className="flex flex-row space-x-2 items-center justify-center w-full bg-blue-800 dark:bg-blue-500 text-white dark:text-gray-100 text-bold p-2 rounded shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={otpInput.length !== 6 || attempts >= maxAttempts}
            >
              <icons.email fontSize="small" />
              <p>Verify Code</p>
            </button>
            
            <button
              type="button"
              onClick={handleBackToLogin}
              className="flex flex-row space-x-2 items-center justify-center w-full bg-gray-600 dark:bg-gray-700 text-white dark:text-gray-100 text-bold p-2 rounded shadow-lg"
            >
              <icons.arrowLeft fontSize="small" />
              <p>Back to Login</p>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default OtpForm;
