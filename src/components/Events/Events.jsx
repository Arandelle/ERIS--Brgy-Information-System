import React from 'react'
import Maintenance from '../ReusableComponents/Maintenance'
import HeadSide from '../ReusableComponents/HeaderSidebar'

const Events = () => {
    return (
      <HeadSide child={  
      <div className="m-3"> <Maintenance title={"Events Section"}/>
      </div>}
      />   
    )
}

export default Events;
