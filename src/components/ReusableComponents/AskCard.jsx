import React from "react";
import icons from "../../assets/icons/Icons";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const AskCard = ({ toggleModal, question, confirmText,onConfirm }) => {
  return (
    <div
      id="popup-modal"
      tabIndex="-1"
      className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center shadow-lg"
    >
      <div className="relative h-full p-2 w-full max-w-60 md:p-4 md:max-w-md  md:h-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            type="button"
            onClick={toggleModal}
            className="absolute top-1 right-1 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-7 h-7 md:w-8 md:h-8 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="popup-modal"
          >
            <icons.close fontSize="small" />
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-3 md:p-5 text-center">
            <svg
              className="mx-auto mb-4 text-gray-400 w-8 h-8 md:w-12 md:h-12 dark:text-gray-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 className="mb-3 text-sm md:mb-5 md:text-lg font-normal text-gray-600 dark:text-gray-400">
              {question}
            </h3>
            <button
              data-modal-hide="popup-modal"
              type="button"
              onClick={onConfirm}
              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-4 py-2 md:px-5 md:py-2.5 text-center"
            >
              {confirmText}
            </button>
            <button
              data-modal-hide="popup-modal"
              type="button"
              onClick={toggleModal}
              className="px-4 py-2 md:py-2.5 md:px-5 ml-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskCard;
