import React, {useState} from 'react'
import HeadSide from '../ReusableComponents/HeaderSidebar';
import Maintenance from '../ReusableComponents/Maintenance'

const Events = () => {
    return (
      <HeadSide child={
        <div className="m-3"><Maintenance title={"News Section"}/>
        </div>}/>
    )
}
export default Events
