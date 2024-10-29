import React, { useEffect, useState } from 'react'

const SearchQuery = (data, searchQuery, searchField) => {
    
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        let updatedData = data;

        // Handle search query
        if(searchQuery && searchField){
            updatedData = updatedData.filter((item) => 
            item[searchField]?.toString().toLowerCase().includes(searchQuery.toLowerCase()));
        }

        setFilteredData(updatedData)
    })
  return filteredData
}

export default SearchQuery
