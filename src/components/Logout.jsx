import React from 'react'
import { useNavigate } from 'react-router-dom';

const Logout = ({setAuth}) => {
    const navigate = useNavigate();
    const handleLogout = () =>{
        setAuth(false);
        navigate('/');
    }
  return (
    <div>
        <button className="text-lg text-white bg-gray-800 p-2" onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Logout
