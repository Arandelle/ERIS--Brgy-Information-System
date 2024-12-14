import React, { useState } from 'react'
import HeaderAndSideBar from '../components/ReusableComponents/HeaderSidebar'
import ButtonStyle from '../components/ReusableComponents/Button'
import icons from '../assets/icons/Icons'
import CreateTemplate from './CreateTemplate'

const ListOfTemplates = () => {

    const [showAddTemplate, setShowAddTemplate] = useState(false);

  return (
    <HeaderAndSideBar 
        content={
        <div className='p-2'>
           <ButtonStyle 
            icon={icons.addCircle}
            color={"gray"}
            label={"Create Template"}
            fontSize={"small"}
            onClick={() => setShowAddTemplate(true)}
           />

           {showAddTemplate && (
            <CreateTemplate 
                setShowAddTemplate={setShowAddTemplate}
            />
           )}
        </div>}
    />
  )
}

export default ListOfTemplates
