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
      return;
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
    await push(dataRef, dataBasedOnType[type]);
    toast.success(
      `${type.charAt(0).toUpperCase() + type.slice(1)} submitted successfully!`
    );
  } catch (error) {
    toast.error(`Error adding ${type}: ${error}`);
  }
};

export default handleAddData;
