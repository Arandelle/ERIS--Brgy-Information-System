import { useState, useEffect } from 'react';

function useFilteredData(data, searchQuery, searchFields) {
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredData(data);
      return;
    }

    const searchTerm = searchQuery.toLowerCase();

    const filteredResults = data.filter((item) =>
      searchFields.some((field) => {
        const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], item);
        return fieldValue?.toString().toLowerCase().includes(searchTerm);
      })
    );

    setFilteredData(filteredResults);
  }, [data, searchQuery, searchFields]);

  return filteredData;
}

export default useFilteredData;