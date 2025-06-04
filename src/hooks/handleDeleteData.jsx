import { database, storage } from "../services/firebaseConfig";
import { get, remove, ref } from "firebase/database";
import { ref as storageRef, deleteObject} from "firebase/storage";
import { toast } from "sonner";

const handleDeleteData = async (id, type) => {
  // path to from the database
  const dataRef = ref(database, `${type}/${id}`);

  try {
    if (id) {
      // First, fetch the data to get the image path
      const snapshot = await get(dataRef);
      if (snapshot.exists()) {
        const activityData = snapshot.val();
        // Assuming the image path is stored under data.imageUrl
        const imagePath = activityData.imageUrl;

        // Remove the data from Realtime Database
        await remove(dataRef);

        // If there is an image associated with the data, remove it from Firebase Storage
        if (imagePath) {
          const imageRef = storageRef(storage, imagePath); // Reference to the image in Firebase Storage
          await deleteObject(imageRef); // Delete the image from Firebase Storage
        }

        toast.success(`Successfully removed`);
      }
    }
  } catch (error) {
    toast.error(`Error: ${error}`);
  }
};

export default handleDeleteData;
