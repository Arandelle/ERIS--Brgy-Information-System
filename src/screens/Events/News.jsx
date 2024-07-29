import React, {useState} from 'react'
import HeadSide from '../../components/ReusableComponents/HeaderSidebar';
import Maintenance from '../../components/ReusableComponents/Maintenance';

const News = () => {
    return (
      <HeadSide child={
        <div className="m-3"><Maintenance title={"News Section"}/>
        </div>}/>
    )
}
export default News
