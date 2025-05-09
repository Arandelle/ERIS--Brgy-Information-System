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
        let fileUrl = existingData.fileUrl; // retain the existing image url
        let fileType = existingData.fileType 

        //check if new image is selected
        if (data?.file) {
          const file = data.file;
          fileType = data.fileType;

          const imageRef = storageRef(
            storage,
            `${type}-${fileType}s/${file.name}`
          );

          //upload the new image
          try {
            await uploadBytes(imageRef, file);
            fileUrl = await getDownloadURL(imageRef);

            //Delete the current image if it exists
            if (existingData.fileUrl) {
              const oldImageRef = storageRef(
                storage,
                existingData.fileUrl
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
            fileUrl
          },
          users:{
            ...dataWithDateAndTimestamp,
          },
          responders:{
            ...dataWithDateAndTimestamp,
          },
          systemData: {
            ...dataWithDateAndTimestamp,
            fileUrl
          },
          announcement: {
            ...dataWithDateAndTimestamp,
            fileUrl,
            fileType,
            isEdited: true,
          },
          hotlines: {
            ...dataWithDateAndTimestamp,
            email: data.email || "",
            fileUrl,
            fileType,
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

        toast.info(`Successfully updated`);

      } else {
        toast.error(`${type} not found`);
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
      console.error("Error", error);
    }
  };

  export default handleEditData