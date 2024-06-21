import React from 'react'
import HeadSide from '../../ReusableComponents/HeaderSidebar';
import Maintenance from '../../ReusableComponents/Maintenance';

const TermsConditions = () => {
  return (
    <HeadSide child={
        <div className='m-3'>
            <Maintenance title={"Terms & Conditions"}/>
        </div>
    }/>
  )
}

export default TermsConditions
