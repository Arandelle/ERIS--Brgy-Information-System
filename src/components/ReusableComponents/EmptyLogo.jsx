import React from 'react'
import emptyMessage from "../../assets/question.svg"

const EmptyLogo = ({ message }) => {
  return (
    <div className="text-center flex flex-col justify-center items-center text-gray-500 dark:text-gray-400">
      <img
        src={emptyMessage}
        alt="Empty Image"
        className="h-[200px] w-[200px]"
      />
      <p className="mt-4">{message}</p>
    </div>
  )
}

export default EmptyLogo;
