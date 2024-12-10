import { database, storage } from "../services/firebaseConfig";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { ref, serverTimestamp, update, get} from "firebase/database";
import { toast } from "sonner";

const handleEditData = async (id,data, type) => {
    const {title, description,links, image,organization,name,contact,email} = data

    if(type === "announcement"){
        if (!title || !description) {
            toast.warning("Please complete the form");
            return;
          }
    } else if(type === "hotlines"){
      if(!organization || !name || (!contact && !email)){
        toast.warning("Please complete the form");
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

        const dataBasedOnType = {
          announcement : {
            title,
            description,
            links,
            imageUrl,
            isEdited: true,
            timestamp: serverTimestamp(),
          },
          hotlines : {
            organization,
            name,
            contact,
            email,
            description,
            isEdited: true,
            timestamp: serverTimestamp()
          }
        }

        await update(dataRef, dataBasedOnType[type]);

        toast.success(`${type} update successfully`);

      } else {
        toast.error(`${type} not found`);
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
      console.error("Error", error);
    }
  };

  export default handleEditData