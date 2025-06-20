import { useEffect, useState } from "react";

export default function useDebounce(value, delay = 500) {
  const [debounceValue, setDebounceValue] = useState(value);
  const [debounceLoading, setDebounceLoading] = useState(false);

  useEffect(() => {
    setDebounceLoading(true); // set the to true when  value changes
    const handler = setTimeout(() => {
      setDebounceValue(value); 
      setDebounceLoading(false); 
    }, delay);

    return () => clearTimeout(handler); // cleanup
  }, [value, delay]);

  return {debounceValue, debounceLoading};
}
