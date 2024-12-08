import icons from "../../assets/icons/Icons";

const Modal = ({
  closeButton,
  children
}) => {
  return (
    <div className="fixed flex items-center justify-center inset-0 z-50 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
    {/**Overlay for darker background */}
    <div
      className="fixed inset-0 z-40 bg-black bg-opacity-50"
      onClick={closeButton}
    ></div>
    {/**Modal Content */}
    <div className="relative z-50 w-full max-w-lg mx-4 my-6 md:mx-auto">
      <div className="relative flex flex-col w-full bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={closeButton}
          className="absolute top-3 right-3 z-50 text-gray-400 bg-transparent rounded-md hover:bg-red-400 hover:text-white text-sm w-7 h-7 md:w-8 md:h-8 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
          data-modal-hide="popup-modal"
        >
          <icons.close fontSize="small" />
          <span className="sr-only">Close modal</span>
        </button>
            <div className="relative p-6 flex-auto">{children}</div>
      </div>
    </div>
  </div>
  );
};

export default Modal;
