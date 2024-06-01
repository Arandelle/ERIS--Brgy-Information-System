import React, {useState} from 'react'
import HeadSide from '../ReusableComponents/HeadSide';
import Maintenance from '../ReusableComponents/Maintenance'

const Events = () => {
    return (
      <HeadSide child={<Maintenance title={"News Section"}/>}/>
    )
}
export default Events
