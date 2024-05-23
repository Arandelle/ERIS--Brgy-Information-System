import React from 'react'
import { useState, useEffect } from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar/Sidebar'
import { Toggle } from '../../hooks/Toggle'
import Skeleton from '../Skeleton'
import Image from '../../assets/logo.png'

const Announcement = () => {
    const {isOpen, toggleDropdown}= Toggle();
    const [loading, setLoading] = useState(true);
    return (
      <div className='w-full flex-col flex'>
        <Header toggleSideBar={toggleDropdown}/>
        <div className='flex'>
            <div className='fixed z-50'>
              <Sidebar isOpen={isOpen} toggleSidebar={toggleDropdown}/>
            </div>
            <div className={`w-full ${isOpen ? "ml-0" : "md:ml-60"}`}>
              <h1 className='dark:text-white mx-3 my-3'>This is announcement</h1>
              {loading ? (<Skeleton loading={loading} setLoading={setLoading}/>) :
              (
                  <div className='fixed inset-0 flex items-center justify-center'>
                    <img src={Image} alt="" />
                  </div>
              )}
            </div>
        </div>      
      </div>
    )
}

export default Announcement
