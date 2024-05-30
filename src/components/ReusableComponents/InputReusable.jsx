import React, {useState, useEffect} from 'react'

const InputReusable = ({ type, placeholder, value, onChange, onFocus,onBlur, notAllowed }) => {

  return (
    <input className={`w-full px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400 dark:placeholder:text-gray-200 dark:text-gray-200 dark:bg-gray-600 ${notAllowed ? "cursor-wait" : "cursor-auto"}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur} />
  )
}

export default InputReusable;
