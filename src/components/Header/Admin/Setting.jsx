import React from 'react'
import HeadSide from '../../ReusableComponents/HeaderSidebar'
import Maintenance from '../../ReusableComponents/Maintenance'

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
