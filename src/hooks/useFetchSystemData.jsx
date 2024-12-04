import { useEffect, useState } from "react"

const useFetchSystemData = () => {

    const [systemState, setSystemState] = useState({
        originalTitle: "",
        newTitle: "",
        previewImage: "",
        originalImageUrl: "",
        newImageFile: null,
        isModified: false,
      });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
    })

  return (
    <div>
      
    </div>
  )
}

export default useFetchSystemData
