import React from 'react'
import HeadSide from '../../components/ReusableComponents/HeaderSidebar'
import Maintenance from '../../components/ReusableComponents/Maintenance'

const FAQS = () => {
  return (
    <HeadSide child={
        <div className='m-3'>
            <Maintenance title={"FAQS"}/>
        </div>
    }/>
  )
}

export default FAQS
