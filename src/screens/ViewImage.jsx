import icons from "../assets/icons/Icons"

const ViewImage = ({currentImage, closeModal}) => {

  return (
    <div className='fixed flex items-center justify-center inset-0 overflow-x-hidden overflow-y-auto z-50'>
    {/**Overlay bg for darker background */}
    <div className='fixed inset-0 bg-slate-950 z-0 opacity-80'
     onClick={closeModal}>
     </div>
    <icons.close
        className="text-white z-50 absolute top-2 right-2 cursor-pointer hover:bg-red-500"
        onClick={closeModal}
    />
      <img
        src={currentImage}
        className='max-w-[90%] max-h-[90%] z-50'
      />
    </div>
  )
}

export default ViewImage
