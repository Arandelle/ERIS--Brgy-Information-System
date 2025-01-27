import { database, storage } from "../services/firebaseConfig";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { ref, serverTimestamp, update, get} from "firebase/database";
import { toast } from "sonner";

const handleEditData = async (id,data, type) => {
 
    const dataRef = ref(database, `${type}/${id}`);

    try {
      const snapshot = await get(dataRef);

      if (snapshot.exists()) {
        const existingData = snapshot.val();
        let imageUrl = existingData.imageUrl; // retain the existing image url

        //check if new image is selected
        if (data?.image) {
          const imageFile = data.image;
          const imageRef = storageRef(
            storage,
            `${type}-images/${imageFile.name}`
          );

          //upload the new image
          try {
            await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(imageRef);

            //Delete the current image if it exists
            if (existingData.imageUrl) {
              const oldImageRef = storageRef(
                storage,
                existingData.imageUrl
              );
              try{
                await deleteObject(oldImageRef);
              }catch(error){
                toast.error(`Old image deletion failed : ${error}`)
              }
             
            }
          } catch (error) {
            toast.error(`Error uploading new image: ${error}`);
            return;
          }
        };

        const dataWithDateAndTimestamp = {
          ...data,
          date: data.date || new Date().toISOString(),
          timestamp: serverTimestamp(),
        };
      
        const dataBasedOnType = {
          admins: {
            ...dataWithDateAndTimestamp,
            imageUrl
          },
          systemData: {
            ...dataWithDateAndTimestamp,
            imageUrl
          },
          announcement: {
            ...dataWithDateAndTimestamp,
            imageUrl,
            isEdited: false,
          },
          hotlines: {
            ...dataWithDateAndTimestamp,
          },
          templateContent: {
            ...dataWithDateAndTimestamp,
          },
          templates: {
            ...dataWithDateAndTimestamp,
          },
          requestClearance: {
            ...dataWithDateAndTimestamp,
          },
        };

        await update(dataRef, dataBasedOnType[type]);

        toast.success(`${type?.toLowerCase()} updated successfully`);

      } else {
        toast.error(`${type} not found`);
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
      console.error("Error", error);
    }
  };

  export default handleEditData