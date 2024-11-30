import { useState } from 'react'
import HeadSide from '../../components/ReusableComponents/HeaderSidebar'

const Setting = () => {
  const [title, setTitle] = useState("");
  const [logo, setLogo] = useState("");

  return (
    <HeadSide child={
        <div className='m-3'>
          <button>Upload Logo</button>
        </div>
    }/>
  )
}

export default Setting
