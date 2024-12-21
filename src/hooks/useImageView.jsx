import { useState } from 'react'

const useImageView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState("");

    const openModal = (image) => {
        setCurrentImage(image);
        setIsModalOpen(true);
    };
    const closeModal = () =>{
        setIsModalOpen(false);
        setCurrentImage("")
    }
  return {
    isModalOpen,
    currentImage,
    openModal,
    closeModal
  }
}

export default useImageView
