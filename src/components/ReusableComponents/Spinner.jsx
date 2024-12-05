import icons from "../../assets/icons/Icons";

export const Spinner = ({loading}) => {
  if(!loading) return null;
  return (
    <div>
     <icons.spinner fontSize="large" className="animate-spin text-blue-500"/>
      <span class="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
