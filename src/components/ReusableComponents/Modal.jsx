import icons from "../../assets/icons/Icons";

const Modal = ({
  closeButton,
  children
}) => {
  return (
    <div className="flex fixed items-center justify-center inset-0 z-50">
      <div
        className="fixed items-center justify-center h-full w-full bg-gray-600 bg-opacity-50"
        onClick={closeButton}
      ></div>
      <div className="relative space-y-4 p-5 lg:w-1/3 bg-white rounded-md shadow-md">
        <button
          type="button"
          onClick={closeButton}
          className="text-gray-400 bg-transparent absolute top-0 right-0 hover:bg-red-400 hover:text-white text-sm w-7 h-7 md:w-8 md:h-8 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
          data-modal-hide="popup-modal"
        >
          <icons.close fontSize="small" />
          <span className="sr-only">Close modal</span>
        </button>
            {children}
      </div>
    </div>
  );
};

export default Modal;
