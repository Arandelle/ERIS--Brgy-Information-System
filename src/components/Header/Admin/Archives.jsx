import React from 'react'
import HeadSide from '../../ReusableComponents/HeaderSidebar';
import Maintenance from '../../ReusableComponents/Maintenance';

const Archives = () => {
  return (
    <HeadSide child={
        <div className='m-3'>
            <Maintenance title={"Archives"}/>
        </div>
    }/>
  )
}

export default Archives
