import { useState, useEffect,useRef } from "react";

const ContainerResizer = (initialSize = 'large') => {
    const [containerSize, setContainerSize] = useState(initialSize);
    const containerRef = useRef(null);
    
      useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
          const newContainerSize = entries[0].contentRect.width < 500 ? 'small' : 'large';
          setContainerSize(newContainerSize);
        });
    
        resizeObserver.observe(containerRef.current);
    
        return () => {
          resizeObserver.disconnect();
        };
      }, []);

  return {containerSize, containerRef};
}

export default ContainerResizer
