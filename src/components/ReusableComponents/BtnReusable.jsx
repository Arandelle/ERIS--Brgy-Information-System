import React from 'react'

const BtnReusable = ({onClick,value, variant}) => {
    const variantClasses = {
        add: "bg-blue-500 hover:bg-blue-600 focus:bg-blue-600",
        edit: "bg-green-500 hover:bg-green-600 focus:bg-green-600"
    };
  return (
    <button
    onClick={onClick}
    className={`px-4 text-white rounded-md shadow-sm focus:outline-none ${ variantClasses[variant] || ""}`}
  >
    {value}
  </button>
  )
}

export default BtnReusable;
