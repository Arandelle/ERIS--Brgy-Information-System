import React, {useState} from 'react'

const Popover = ({children, content }) => {
    const [visible, setVisible] = useState(false);
    const showPopover = () => setVisible(!visible);
    const hidePopover = () => setVisible(false);

  return (
    <div className='relative inline-block' onClick={showPopover} onBlur={hidePopover}>   
      {children}
      {visible && (
     <div className='absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 transition-opacity duration-300 opacity-100 dark:bg-gray-800 dark:border-gray-600'>
            <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Popover hover</h3>
          </div>
          <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
            <p>{content}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export const PopoverHover = ({ children, content, className }) => {
  const [visible, setVisible] = useState(false);
  const showPopover = () => setVisible(!visible);
  const hidePopover = () => setVisible(false);

   return (
     <div className='relative inline-flex z-50 items-center cursor-pointer' onMouseEnter={showPopover} onMouseLeave={hidePopover}>   
      {children}
      {visible && (
    <div className={`fixed mt-20 transform -translate-x-1/2  w-54 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-opacity duration-300 opacity-100 dark:bg-gray-800 dark:border-gray-600 ${className}`}>
     <div className={`px-3 py-2 text-sm text-gray-500 dark:text-gray-400`}>
       <p className='text-nowrap'>{content}</p>
          </div>
        </div>
      )}
    </div>
  )
};

export default Popover
