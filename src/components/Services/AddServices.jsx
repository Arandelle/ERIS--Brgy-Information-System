import React from 'react'
import { useState, useEffect } from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar/Sidebar'
import { Toggle } from '../../hooks/Toggle'
import Skeleton from '../ReusableComponents/Skeleton'
import Maintenance from '../ReusableComponents/Maintenance'

const AddServices = () => {
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
            <div className='m-3'>
              {loading ? (<Skeleton loading={loading} setLoading={setLoading}/>) :
                (
                <Maintenance title={"Add services"}/>
                )}
            </div>
            </div>
        </div>      
      </div>
    )
}

export default AddServices
