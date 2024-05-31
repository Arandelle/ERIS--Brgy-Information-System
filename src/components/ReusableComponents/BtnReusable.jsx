import React from 'react'

const BtnReusable = ({onClick,value, type}) => {
  
    const btnType =()=>{
      switch(type){
        case 'add': return 'bg-blue-500 hover:bg-blue-600 focus:bg-blue-600';
        case 'edit': return 'bg-green-500 hover:bg-green-600 focus:bg-green-600';
        default: return 'bg-gray-500 hover:bg-gray-600 focus:bg-gray-600'
      }
    }
  return (
    <button
    onClick={onClick}
    className={`px-4 py-2 text-white rounded-md shadow-sm focus:outline-none ${btnType()}`}
  >
    {value}
  </button>
  )
}

export default BtnReusable;
