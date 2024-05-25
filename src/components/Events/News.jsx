import React from 'react'
import { useState, useEffect } from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar/Sidebar'
import { Toggle } from '../../hooks/Toggle'
import Skeleton from '../Skeleton'
import NewsList from './NewsList'

const News = () => {
  const {isOpen, toggleDropdown}= Toggle();
  const [loading, setLoading] = useState(true);

  const [news, setNews] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAddNews = () =>{
    if(!title || !content){
      alert("Please complete the form");
      return
    }

    const addedNews = {
      title,
      content
    };

    setNews((prevEvents) => [...prevEvents, addedNews]);
    setTitle("");
    setContent("");
  }

  return (
    <div className='w-full flex-col flex'>
      <Header toggleSideBar={toggleDropdown}/>
      <div className='flex'>
          <div className='fixed z-50'>
            <Sidebar isOpen={isOpen} toggleSidebar={toggleDropdown}/>
          </div>
          <div className={`w-full ${isOpen ? "ml-0" : "md:ml-60"}`}>
          <div className='m-3'>
            {loading ? (<Skeleton loading={loading} setLoading={setLoading}/>) :
              (
                <div className='flex flex-col gap-4'>
                  <div className="grid justify-start grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-15 my-15 gap-4">
                  <input
                    className="w-full px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400 dark:placeholder:text-gray-50 dark:text-white dark:bg-gray-600"
                    type="text"
                    value={title}
                    placeholder="Event Title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                   </div>
                  <div>
                    <textarea
                      className="w-full relative z-1 px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-gray-400 dark:placeholder:text-gray-50 dark:text-white dark:bg-gray-600"
                      value={content}
                      placeholder="Write your news"
                      onChange={(e) => setContent(e.target.value)}
                    />
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    onClick={handleAddNews}>
                      Submit
                    </button>
                  </div>
                  <div>
                    <NewsList news={news}/>
                </div>
                </div>
             
              )}
          </div>
          </div>
      </div>      
    </div>
  )
}

export default News
