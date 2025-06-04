import icons from "../../assets/icons/Icons";
import erisLogo from "../../assets/images/erisLogo.png"

export const Spinner = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="flex flex-col items-center justify-center space-x-2">
     <img src={erisLogo} className="h-32 w-32" alt="Loading" />
     <div className="flex flex-row item-center justify-center space-x-2 p-4">
       <icons.spinner fontSize="large" className="animate-spin text-blue-500" />
        <div className="text-center place-content-center">Loading please wait...</div>
     </div>
    </div>
  );
};

export default Spinner;
