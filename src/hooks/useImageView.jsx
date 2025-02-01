import { useState } from 'react'
import useSearchParam from './useSearchParam';

const useImageView = () => {
  const {searchParams, setSearchParams} = useSearchParam();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState("");

    const openModal = (image) => {
        setCurrentImage(image);
        setIsModalOpen(true);
        setSearchParams({uid: image})

        console.log(image)
    };
    const closeModal = () =>{
        setIsModalOpen(false);
        setCurrentImage("")
        setSearchParams({})
    }
  return {
    isModalOpen,
    currentImage,
    openModal,
    closeModal
  }
}

export default useImageView
