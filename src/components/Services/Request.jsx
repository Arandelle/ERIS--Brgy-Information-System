import React from 'react'
import Maintenance from '../ReusableComponents/Maintenance'
import HeadSide from '../ReusableComponents/HeaderSidebar'

const Request = () => {
    return (
      <HeadSide child={<div className="m-3"><Maintenance title={"News Section"}/>
      </div>}/>
    )
}

export default Request
