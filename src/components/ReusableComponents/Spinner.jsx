import { useEffect, useState } from "react";
import icons from "../../assets/icons/Icons";
import { useFetchSystemData } from "../../hooks/useFetchSystemData";

export const Spinner = ({ loading }) => {
  if (!loading) return null;

  const [image, setImage] = useState(localStorage.getItem("image") || ""); 
  const { systemData } = useFetchSystemData();

  useEffect(() => {
    if (systemData) {
      const imageUrl = systemData?.imageUrl;
      setImage(imageUrl);
      localStorage.setItem("image", imageUrl);
    }
  }, [systemData]);

  return (
    <div className="flex flex-col items-center justify-center space-x-2">
      {image && <img src={image} className="h-32 w-32" alt="Loading" />}
     <div className="flex flex-row item-center justify-center space-x-2 p-4">
       <icons.spinner fontSize="large" className="animate-spin text-blue-500" />
        <div className="text-center place-content-center">Loading please wait...</div>
     </div>
    </div>
  );
};

export default Spinner;
