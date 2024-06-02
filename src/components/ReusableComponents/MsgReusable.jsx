import React from 'react'

const MsgReusable = ({message, type}) => {

    const getMessageColor = () => {
        switch (type) {
            case 'success': return 'text-blue-600 dark:text-blue-500';
            case 'delete' : return 'text-red-600 dark:text-red-500';
            default: return 'text-blue-600 dark:text-blue-500';
        }
    };
  return (
    <div className="flex justify-center items-center">
          <div
            className={`flex absolute z-50 justify-center items-center p-2 mb-4 mt-4 text-sm rounded-lg bg-gray-300 dark:bg-gray-900 ${getMessageColor()}`}
            role="alert"
          >
            <svg
              className="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            {message}
          </div>
        </div>
  )
}

export default MsgReusable
