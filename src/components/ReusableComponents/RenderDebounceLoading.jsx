import React from 'react'
import icons from '../../assets/icons/Icons'

  const RenderDebounceLoading = () => {
    return (
     <div className="h-72 flex flex-col items-center justify-center">
      <icons.spinner fontSize="large" className="animate-spin text-blue-800"/>
      <p className="text-blue-800 text-lg">Searching...</p>
     </div>
    )
  }

export default RenderDebounceLoading
