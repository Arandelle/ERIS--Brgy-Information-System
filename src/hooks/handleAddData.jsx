import { push, ref, serverTimestamp } from "firebase/database";
import { toast } from "sonner";
import { database, storage } from "../services/firebaseConfig";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const handleAddData = async (data, type) => {
  const { title, description, image, links, date, organization, name, contact,email,content,docsType } = data;

  if (type === "announcement") {
    if (!title || !description) {
      toast.warning("Please complete the form");
      return;
    }
  } else if (type === "hotlines") {
    if (!organization || !name || (!contact && !email)) {
      toast.warning("Please complete the form");
      return;
    }
  } else if (type === "templates"){
    if(!title || !docsType){
      toast.warning("Please complete the form");
      return;
    }
  }

  let imageUrl = "";

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

  const dataBasedOnType = {
    announcement: {
      title,
      description,
      links,
      imageUrl,
      date: date || new Date().toISOString(),
      isEdited: false,
      timestamp: serverTimestamp(),
    },
    hotlines: {
      organization,
      name,
      contact: contact || "",
      email: email || "",
      description: description ||"",
      date: new Date().toISOString(),
      timestamp: serverTimestamp(),
    },
    templates: {
      title,
      docsType,
      content
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
