import {useState} from "react";

export const Toggle = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleDropdown = () => {
            setIsOpen(!isOpen);
    };
    
    return  {isOpen, toggleDropdown };
};