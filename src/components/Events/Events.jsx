import React, { useState } from 'react';
import HeaderSidebar from '../ReusableComponents/HeaderSidebar';
import { Toggle } from '../../hooks/Toggle';
import Skeleton from '../ReusableComponents/Skeleton';
import Maintenance from '../ReusableComponents/Maintenance';

const Events = () => {
    const { isOpen, toggleDropdown } = Toggle();
    const [loading, setLoading] = useState(true);

    return (
        <HeaderSidebar child={
            loading ? (
                <Skeleton loading={loading} setLoading={setLoading} />
            ) : (
                <Maintenance title={"Events nga ba"} />
            )
        } />
    );
};

export default Events;
