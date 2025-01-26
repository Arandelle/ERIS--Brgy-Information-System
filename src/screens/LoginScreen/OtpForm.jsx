import OTP from "../../assets/images/otp.svg";

const OtpForm = ({handleVerify, emailToMask, setOtpInput, otpInput}) => {
  return (
    <form
      className={`flex flex-col space-y-4`}
      onSubmit={handleVerify}
    >
      <div className="place-items-center">
        {" "}
        <img src={OTP} alt="Image" className="h-60 w-60" />
      </div>
      <h1 className="text-red-600 dark:text-gray-300 py-2">
        Enter the otp we have sent to your email{" "}
        <span className="font-bold italic">{emailToMask}</span>
      </h1>
      <div className="flex flex-row space-x-2 ">
        <input
          class=""
          type="text"
          placeholder="Enter OTP"
          value={otpInput}
          onChange={(e) => setOtpInput(e.target.value)}
        />
        <button
          className="w-full bg-blue-800 text-white text-bold py-2 px-4 rounded"
          type="submit"
        >
          Verify
        </button>
      </div>
    </form>
  );
};

export default OtpForm;
