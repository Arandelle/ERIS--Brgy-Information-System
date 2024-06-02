import { useState, useEffect, useRef } from "react";

const ContainerResizer = () => {
  const [containerSize, setContainerSize] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerSize(containerRef.current.getBoundingClientRect());
      }
    };

    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [containerRef]);

  return { containerSize, containerRef };
};

export default ContainerResizer;
