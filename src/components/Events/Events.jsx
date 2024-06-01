<<<<<<< HEAD
import React, {useState} from 'react'
import Maintenance from '../ReusableComponents/Maintenance'
import HeadSide from '../ReusableComponents/HeaderSidebar'

const Events = () => {
    return (
      <HeadSide child={ <Maintenance title={"Events"}/>}
      />   
    )
}
=======
import React, { useState } from 'react';
import HeaderSidebar from '../ReusableComponents/HeaderSidebar';
import { Toggle } from '../../hooks/Toggle';
import Skeleton from '../ReusableComponents/Skeleton';
import Maintenance from '../ReusableComponents/Maintenance';

const Events = () => {
    const { isOpen, toggleDropdown } = Toggle();
    const [loading, setLoading] = useState(true);
>>>>>>> 1054c582412c3e1da6c98f0702af65a83df0ddd7

    return (
        <HeaderSidebar child={
                <Maintenance title={"Events nga ba"} 
                    toggleDropdown={toggleDropdown}
                    setLoading={setLoading}/>
        } />
    );
};

export default Events;
