import React, {useState} from 'react'
import HeaderSidebar from '../ReusableComponents/HeaderAndSidebar'
import { Toggle } from '../../hooks/Toggle'
import Skeleton from '../ReusableComponents/Skeleton'
import Maintenance from '../ReusableComponents/Maintenance'

const Events = () => {
    const {isOpen, toggleDropdown}= Toggle();
    const [loading, setLoading] = useState(true);
    return (
        <HeaderSidebar child={
                  <Maintenance title={"Events"}/>}
                />
    )
}

export default Events
