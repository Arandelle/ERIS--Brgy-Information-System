import React from 'react'

const InputReusable = ({ type, placeholder, value, onChange, onFocus,onBlur }) => {

  return (
      <input className='w-full px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400 dark:placeholder:text-gray-600 dark:text-gray-800 dark:bg-gray-200'
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur} />
  )
}

export default InputReusable
