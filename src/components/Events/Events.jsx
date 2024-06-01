import React from 'react'
import Maintenance from '../ReusableComponents/Maintenance'
import HeadSide from '../ReusableComponents/HeaderSidebar'

const Events = () => {
    return (
      <HeadSide child={ <Maintenance title={"Events"}/>}
      />   
    )
}

export default Events;
