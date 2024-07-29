import React from 'react'
import HeadSide from '../../components/ReusableComponents/HeaderSidebar';
import Maintenance from '../../components/ReusableComponents/Maintenance';

const Events = () => {
    return (
      <HeadSide child={  
      <div className="m-3"> <Maintenance title={"Events Section"}/>
      </div>}
      />   
    )
}

export default Events;
