import icons from "../assets/icons/Icons";

const MediaModal = ({ currentMedia, mediaType = "image", closeModal }) => {
  return (
    <div className="fixed flex items-center justify-center inset-0 overflow-x-hidden overflow-y-auto z-50">
      {/**Overlay bg for darker background */}
      <div
        className="fixed inset-0 bg-slate-950 z-0 opacity-80"
        onClick={closeModal}
      ></div>
      <icons.close
        className="text-white z-50 absolute top-2 right-2 cursor-pointer hover:bg-red-500"
        onClick={closeModal}
      />
      {mediaType === "image" ? (
        <img src={currentMedia} className="max-w-[90%] max-h-[90%] z-50" />
      ) : mediaType === "video" ? (
        <video controls autoPlay className="max-w-full h-auto z-50">
          <source src={currentMedia} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="z-50 text-white">
          no supporting media
        </div>
      )}
    </div>
  );
};

export default MediaModal;
