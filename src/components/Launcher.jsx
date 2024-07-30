import React from 'react'
import Image from '../assets/logo.png'
import { useState, useEffect } from 'react'

const Luncher = () => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setTimeout(() => {
          setLoading(false);
        }, 2000);
       
      }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
    <img src={Image} alt="Loading" className="max-w-full max-h-full object-cover" />
  </div>
  )
}

export default Luncher
