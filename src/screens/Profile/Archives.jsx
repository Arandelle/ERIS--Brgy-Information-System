import React from 'react'
import HeadSide from '../../components/ReusableComponents/HeaderSidebar'
import Maintenance from '../../components/ReusableComponents/Maintenance'

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
