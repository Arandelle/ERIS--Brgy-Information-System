import React, {useState} from 'react'
import HeadSide from '../ReusableComponents/HeaderSidebar';
import Maintenance from '../ReusableComponents/Maintenance'

const Events = () => {
    return (
      <HeadSide child={<Maintenance title={"News Section"}/>}/>
    )
}
export default Events
