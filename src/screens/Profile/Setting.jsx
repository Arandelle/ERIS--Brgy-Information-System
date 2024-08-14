import React from 'react'
import HeadSide from '../../components/ReusableComponents/HeaderSidebar'
import Maintenance from '../../components/ReusableComponents/Maintenance'

const Setting = () => {
  return (
    <HeadSide child={
        <div className='m-3'>
            <Maintenance title={"Account Settings"} />
        </div>
    }/>
  )
}

export default Setting
