import React, {useState} from 'react'
import Maintenance from '../ReusableComponents/Maintenance'
import HeadSide from '../ReusableComponents/HeadSide'

const Events = () => {
    return (
      <HeadSide child={ <Maintenance title={"Events"}/>}
      />   
    )
}

export default Events
