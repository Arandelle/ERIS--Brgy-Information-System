import { database, storage } from "../services/firebaseConfig";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { ref, serverTimestamp, update, get} from "firebase/database";
import { toast } from "sonner";

const handleEditData = async (id,data, type) => {
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
    const dataRef = ref(database, `${type}/${id}`);

    try {
      const snapshot = await get(dataRef);

      if (snapshot.exists()) {
        const announcementData = snapshot.val();
        let imageUrl = announcementData.imageUrl; // retain the existing image url

        //check if new image is selected
        if (image) {
          const imageFile = image;
          const imageRef = storageRef(
            storage,
            `${type}-images/${imageFile.name}`
          );

          //upload the new image
          try {
            await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(imageRef);

            if (announcementData.imageUrl) {
              const oldImageRef = storageRef(
                storage,
                announcementData.imageUrl
              );
              await deleteObject(oldImageRef);
            }
          } catch (error) {
            toast.error(`Error uploading new image: ${error}`);
            return;
          }
        }

        const updatedData = {
          title,
          description,
          imageUrl,
          isEdited: true,
          timestamp: serverTimestamp(),
        };

        if(type === "event"){
            updatedData.location = location,
            updatedData.startDate = startDate,
            updatedData.endDate = endDate,
            updatedData.organizer = organizer
          }

        await update(dataRef, updatedData);

        toast.success("Announcement update successfully");

      } else {
        toast.error("Announcement not found");
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
      console.error("Error", error);
    }
  };

  export default handleEditData