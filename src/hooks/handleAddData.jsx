import { push, ref, serverTimestamp } from "firebase/database";
import { toast } from "sonner";
import { database, storage } from "../services/firebaseConfig";
import {ref as storageRef, uploadBytes, getDownloadURL} from "firebase/storage"

const handleAddData = async (data ,type) => {

    const {title, description, image, date, location, startDate, endDate, organizer} = data

    if(type === "announcement"){
        if (!title || !description) {
            toast.info("Please complete the form");
            return;
          }
    } else{
        if (!location || !startDate || !endDate || !organizer) {
            toast.info("Please complete the form");
            return;
          }
    }
    let imageUrl = ""

    if (image) {
        const imageFile = image;
        const imageRef = storageRef(storage, `${type}-images/${imageFile.name}`);
    
        try {
          await uploadBytes(imageRef, imageFile);
          imageUrl = await getDownloadURL(imageRef);
        } catch (error) {
          console.error(`Error uploading ${type} image: `, error);
          toast.error(`Error uploading image: ${error}`);
          return;
        }
      }

      const newData = {
        title,
        description,
        imageUrl,
        date: date || new Date().toISOString(),
        isEdited: false,
        timestamp: serverTimestamp()
      }

      if(type === "event"){
        newData.location = location,
        newData.startDate = startDate,
        newData.endDate = endDate,
        newData.organizer = organizer
      }

      const dataRef = ref(database, `${type}`)

      try{
        await push(dataRef, newData);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} submitted successfully!`)
      }catch(error){
        toast.error(`Error adding ${type}: `, error)
      }


}

export default handleAddData
