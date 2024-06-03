import React from 'react'
import HeadSide from '../ReusableComponents/HeaderSidebar'
import Maintenance from '../ReusableComponents/Maintenance'

const MyProfile = () => {

  return (
      <HeadSide child={
        <div className='m-3'>
            <Maintenance title={"MyProfile"} />
        </div>
      } />
  )
}

export default MyProfile
