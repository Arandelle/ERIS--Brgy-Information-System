import React from 'react'
import { useSearchParams } from 'react-router-dom'

const useSearchParam = () => {

    const [searchParams, setSearchParams] = useSearchParams();

  return {searchParams, setSearchParams};
}

export default useSearchParam
