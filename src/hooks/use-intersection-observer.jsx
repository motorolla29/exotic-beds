import { useLayoutEffect, useRef } from 'react';

const useIntersectionObserver = ({
  target,
  onIntersect,
  threshold = 0.1,
  rootMargin = '0px',
}) => {
  const isMounted = useRef(true);
  useLayoutEffect(() => {
    isMounted.current = true;
    if (!target.current) return;
    const observer = new IntersectionObserver(onIntersect, {
      rootMargin,
      threshold,
    });
    const current = target.current;
    observer.observe(current);
    return () => {
      isMounted.current = false;
      if (current && current instanceof Element && isMounted.current) {
        observer.unobserve(current);
      }
    };
  }, [target, onIntersect, threshold, rootMargin]);
};

export default useIntersectionObserver;
