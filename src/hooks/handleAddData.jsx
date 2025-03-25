import { push, ref, serverTimestamp } from "firebase/database";
import { toast } from "sonner";
import { database, storage } from "../services/firebaseConfig";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const handleAddData = async (data, type) => {

  let fileUrl = "";
  let fileType = "";

  if (data?.file) {
    const file = data.file;
    fileType = data.fileType;

    const fileRef = storageRef(storage, `${type}-${fileType}s/${file.name}`);

    try {
      await uploadBytes(fileRef, file);
      fileUrl = await getDownloadURL(fileRef);
    } catch (error) {
      console.error(`Error uploading ${fileType} image: `, error);
      toast.error(`Error uploading image: ${error}`);
      return null;
    }
  }

  const dataWithDateAndTimestamp = {
    ...data,
    date: data.date || new Date().toISOString(),
    timestamp: serverTimestamp(),
  };

  const dataBasedOnType = {
    announcement: {
      ...dataWithDateAndTimestamp,
      isEdited: false,
      fileUrl,
      fileType
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
    }
  };

  const dataRef = ref(database, `${type}`);

  try {
    const newRef = push(dataRef, dataBasedOnType[type]); // push the data and get the reference
    const newKey = newRef.key; // get the key of the new data
    toast.success(
      `${type.charAt(0).toUpperCase() + type.slice(1)} submitted successfully!`
    );

    return newKey;  
  } catch (error) {
    toast.error(`Error adding ${type}: ${error}`);
    return null;
  }
};

export default handleAddData;
