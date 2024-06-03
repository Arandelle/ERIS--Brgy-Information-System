import React from 'react'
import Maintenance from '../ReusableComponents/Maintenance'
import HeadSide from '../ReusableComponents/HeaderSidebar'

const AddServices = () => {

    return (
      <HeadSide child={<div className="m-3"><Maintenance title={"Add Services Section"}/>
      </div>}/>
    )
}

export default AddServices
