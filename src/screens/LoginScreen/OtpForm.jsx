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
          class="border-0 rounded-md uppercase text-sm w-full shadow-md"
          type="text"
          placeholder="1 2 3 4 5 6"
          value={otpInput}
          onChange={(e) => setOtpInput(e.target.value)}
          maxLength={6}
        />
        <button
          className="bg-blue-800 text-white text-bold py-2 px-4 rounded shadow-md"
          type="submit"
        >
          Verify
        </button>
      </div>
    </form>
  );
};

export default OtpForm;
