import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { getDatabase, ref, get, update } from "firebase/database";
import handleEditData from "../hooks/handleEditData";
import { generateUniqueBarangayID } from "../helper/generateID";
import logAuditTrail from "../hooks/useAuditTrail";

export default function AccountDeletion() {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const reasons = [
    "I don't use the app anymore",
    "I'm concerned about my privacy",
    "I created a new account",
    "The app doesn't meet my needs",
    "Other",
  ];

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const nextStep = () => {
    if (step === 1 && !reason) {
      setError("Please select a reason for account deletion");
      return;
    }
    if (step === 2 && (!email || !password)) {
      setError("Please provide both email and password");
      return;
    }
    if (step === 3 && confirmText !== "DELETE MY ACCOUNT") {
      setError("Please type the confirmation text exactly as shown");
      return;
    }

    setError("");
    setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  // Determine the user type by checking different collections
  const determineUserType = async (userId) => {
    const db = getDatabase();
    
    try {
      // Check if user exists in admins collection
      const adminRef = ref(db, `admins/${userId}`);
      const adminSnapshot = await get(adminRef);
      if (adminSnapshot.exists()) return 'admins';
      
      // Check if user exists in responders collection
      const responderRef = ref(db, `responders/${userId}`);
      const responderSnapshot = await get(responderRef);
      if (responderSnapshot.exists()) return 'responders';
      
      // Default to regular user
      return 'users';
    } catch (error) {
      console.error('Error determining user type:', error);
      return 'users'; // Default to user type if error occurs
    }
  };

  // Function to anonymize user data
  const anonymizeUserData = async (userId, userType) => {
    const db = getDatabase();
    
    // Generate a anonymized ID with timestamp to ensure uniqueness
    const anonymousId = await generateUniqueBarangayID("anonymous");
    
    try {
      // Determine the path based on user type
      let dataPath;
      switch(userType) {
        case 'admins':
          dataPath = `admins/${userId}`;
          break;
        case 'responders':
          dataPath = `responders/${userId}`;
          break;
        case 'users':
        default:
          dataPath = `users/${userId}`;
          break;
      }

      // Get current user data
      const userRef = ref(db, dataPath);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        
        // Create anonymized version of the data
        const anonymizedData = {
          ...userData,
          // Replace PII with anonymized values
          email: `${anonymousId}@eris.com`,
          img: null,
          mobileNum: null,
          fullname: `Anonymized`,
          address: 'Anonymous Address',
          location: null,
          gender: "Anonymized gender",
          age: "Anonymized age",

          // Keep any non-PII data like created timestamps, preferences, etc.
          
          // Add metadata about anonymization
          anonymized: true,
          anonymizedAt: new Date().toISOString(),
          deletionReason: reason,
          originalUserId: userId
        };

        // Use your existing handleEditData function to update the record
        await handleEditData(userId, anonymizedData, userType);
        
        console.log(`User data anonymized for ${userType} with ID: ${userId}`);
        return true;
      } else {
        console.warn(`No data found for ${userType} with ID: ${userId}`);
        return false;
      }
    } catch (error) {
      console.error('Error anonymizing user data:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // First sign in to verify credentials
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userId = user.uid;
      
      // Determine the user type
      const userType = await determineUserType(userId);
      
      // Anonymize the user data before deleting account
      await anonymizeUserData(userId, userType);
 
      // Delete the Firebase auth account
      await auth.currentUser.delete();
      await logAuditTrail("Deleted an account", userId);
      setSuccess(true);

    } catch (err) {
      console.error("Account deletion error:", err);
      
      if (err.code === 'auth/requires-recent-login') {
        setError(
          "For security reasons, please log out and log back in before deleting your account."
        );
      } else if (err.code === 'auth/wrong-password') {
        setError("Incorrect password. Please try again.");
      } else {
        setError(
          "Error deleting account: " + (err.message || "Please try again later")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-green-500 px-6 py-4">
              <h1 className="text-xl font-medium text-white">
                Account Deleted Successfully
              </h1>
            </div>
            <div className="px-6 py-8">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 text-center mb-6">
                Your account and all associated personal data have been
                permanently deleted from our systems.
              </p>
              <p className="text-gray-600 text-center mb-6 text-sm">
                You will be logged out automatically. If you change your mind,
                you can create a new account anytime.
              </p>
              <div className="mt-6 text-center">
                <a
                  href="/deletion-account"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Return to Home Page
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 px-6 py-4">
            <h1 className="text-xl font-bold text-white">
              ERIS Account Deletion
            </h1>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Progress indicator */}
            <div className="w-full mb-8">
              <div className="flex items-center justify-between relative">
                {[1, 2, 3, 4].map((s, index) => (
                  <div key={s}>
                    <div className="flex flex-col items-center flex-1">
                      {/* Circle */}
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full z-10
              ${
                s < step
                  ? "bg-blue-600 text-white"
                  : s === step
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
                      >
                        {s}
                      </div>
                      {/* Label */}
                      <span className="text-xs mt-2 text-center text-gray-700">
                        {
                          ["Reason", "Verification", "Confirmation", "Process"][
                            index
                          ]
                        }
                      </span>
                    </div>

                    {/* Line */}
                    {s < 4 && (
                      <div className="absolute top-5 left-0 w-full flex justify-between px-5">
                        <div
                          className={`h-1 flex-1 mx-2
                ${s < step ? "bg-blue-600" : "bg-gray-300"}`}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Why do you want to delete your account?
                </h2>
                <p className="text-gray-600 mb-4">
                  We're sorry to see you go. Please let us know why you're
                  deleting your account to help us improve our service.
                </p>

                <div className="space-y-3 mb-6">
                  {reasons.map((r) => (
                    <label key={r} className="flex items-start">
                      <input
                        type="radio"
                        name="reason"
                        value={r}
                        checked={reason === r}
                        onChange={handleReasonChange}
                        className="mt-1 h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">{r}</span>
                    </label>
                  ))}
                </div>

                {reason === "Other" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Please specify:
                    </label>
                    <textarea
                      rows="3"
                      className="shadow-sm block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tell us more about your reason..."
                    ></textarea>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 mt-6">
                  <div className="text-gray-600 text-sm mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">
                      What happens when you delete your account:
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        All your personal information will be anonymized
                      </li>
                      <li>Your emergency reports history will be anonymized</li>
                      <li>Your certificate requests will be deleted</li>
                      <li>You won't be able to recover your account</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Verify your identity
                </h2>
                <p className="text-gray-600 mb-4">
                  For security reasons, please confirm your identity by entering
                  your account credentials.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="shadow-sm block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="shadow-sm block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Final Confirmation
                </h2>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        <strong>Warning:</strong> This action is permanent and
                        cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  To confirm you want to permanently delete your account and all
                  associated data, please type
                  <strong className="text-gray-900"> DELETE MY ACCOUNT </strong>
                  in the field below.
                </p>

                <div className="mb-6">
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="shadow-sm block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type DELETE MY ACCOUNT"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Processing Your Request
                </h2>
                <p className="text-gray-600 mb-6">
                  We're now processing your account deletion request. This will:
                </p>

                <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
                  <li>Anonymize your personal information in our database</li>
                  <li>Remove your account credentials</li>
                  <li>Anonymize any emergency reports you've submitted</li>
                  <li>Delete your certificate requests and history</li>
                </ul>

                <div className="mt-6 flex justify-center">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-8 w-8 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="ml-3 text-gray-700">Processing...</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Delete My Account Now
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Back
                </button>
              )}
              {step < 4 && (
                <button
                  onClick={nextStep}
                  className={`px-4 py-2 ${
                    step === 1 ? "ml-auto" : ""
                  } bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  Continue
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-center text-gray-500">
              Need help? Contact our support team at{" "}
              <a
                href="mailto:eris-support@gmail.com"
                className="text-blue-600 hover:underline"
              >
                eris-support@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}