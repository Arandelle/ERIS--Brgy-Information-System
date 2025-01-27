import { toast } from "sonner";

const handleErrorMessage = (error) => {
  switch (error.code) {
    // Authentication Errors
    case "auth/invalid-credential":
      toast.error("Invalid credential. Please try again.");
      break;
    case "auth/user-disabled":
      toast.error("This user account has been disabled.");
      break;
    case "auth/user-not-found":
      toast.error("No user found with this email.");
      break;
    case "auth/wrong-password":
      toast.error("Invalid password. Please try again.");
      break;
    case "auth/too-many-requests":
      toast.error(
        "Too many unsuccessful attempts. Please try again later."
      );
      break;
    case "auth/email-already-in-use":
      toast.error("Email is already in use. Please use another email.");
      break;
    case "auth/weak-password":
      toast.error("Password is too weak. Please use a stronger password.");
      break;
    case "auth/invalid-email":
      toast.error("Invalid email format. Please enter a valid email.");
      break;

    // Registration Errors
    case "auth/missing-email":
      toast.error("Email is required for this operation.");
      break;

    // Token Errors
    case "auth/id-token-expired":
      toast.error("Your session has expired. Please log in again.");
      break;
    case "auth/id-token-revoked":
      toast.error("Your session has been revoked. Please log in again.");
      break;

    // Credential Errors
    case "auth/invalid-verification-code":
      toast.error("Invalid verification code. Please check and try again.");
      break;
    case "auth/invalid-verification-id":
      toast.error("Invalid verification ID. Please try again.");
      break;

    // Operation Errors
    case "auth/operation-not-allowed":
      toast.error("This operation is not allowed. Contact support.");
      break;

    // Network Errors
    case "auth/network-request-failed":
      toast.error("Network error. Please check your internet connection.");
      break;

    // Recaptcha Errors
    case "auth/captcha-check-failed":
      toast.error("Recaptcha verification failed. Please try again.");
      break;
    case "auth/recaptcha-not-supported":
      toast.error("Recaptcha is not supported in this environment.");
      break;

    // Other Errors
    case "auth/requires-recent-login":
      toast.error("Please log in again to proceed.");
      break;
    case "auth/unverified-email":
      toast.error("Please verify your email before logging in.");
      break;

    default:
      toast.error(`An error occurred: ${error.message}`);
      break;
  }
};

export default handleErrorMessage;
