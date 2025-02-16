import { useState } from 'react'
import useSearchParam from './useSearchParam';

const useViewMedia = () => {
  const {searchParams, setSearchParams} = useSearchParam();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMedia, setCurrentMedia] = useState("");
    const [mediaType, setMediaType] = useState("");

    const openModal = (mediaUrl, type) => {
        setCurrentMedia(mediaUrl);
        setMediaType(type)
        setIsModalOpen(true);
        setSearchParams({uid: mediaUrl})
    };
    const closeModal = () =>{
        setIsModalOpen(false);
        setCurrentMedia("");
        setMediaType("")
        setSearchParams({})
    }
  return {
    isModalOpen,
    currentMedia,
    mediaType,
    openModal,
    closeModal
  }
}

export default useViewMedia
