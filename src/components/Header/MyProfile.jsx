import React from 'react';
import HeadSide from '../ReusableComponents/HeaderSidebar';
import Maintenance from '../ReusableComponents/Maintenance';

const MyProfile = () => {
  return (
    <HeadSide child={
      <div className='h-screen flex-grow-0'>
        <Maintenance title={"MyProfile"} />
      </div>
    } />
  );
}

export default MyProfile;
