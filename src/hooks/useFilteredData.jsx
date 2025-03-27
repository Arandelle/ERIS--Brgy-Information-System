import {useMemo } from 'react';

function useFilteredData(data, searchQuery, searchFields) {
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    const searchTerm = searchQuery.toLowerCase();

    return data.filter((item) =>
      searchFields.some((field) => {
        const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], item);
        return fieldValue?.toString().toLowerCase().includes(searchTerm);
      })
    );
  }, [data, searchQuery, searchFields]);

  return filteredData;
}

export default useFilteredData;
