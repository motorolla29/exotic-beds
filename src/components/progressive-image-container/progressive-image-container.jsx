import { useEffect, useRef, useState } from 'react';
import useIntersectionObserver from '../../hooks/use-intersection-observer';
import InnerImageZoom from 'react-inner-image-zoom';

import './progressive-image-container.sass';

const ProgressiveImageContainer = ({
  alt,
  thumb,
  src,
  withInnerZoom = false,
}) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    //
  }, [src]);

  useIntersectionObserver({
    target: ref,
    onIntersect: ([entry], observerElement) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (ref.current && entry.target && entry.target instanceof Element) {
          observerElement.unobserve(ref.current);
        }
      }
    },
  });

  return (
    <div ref={ref} className="progressive-image-container">
      <img
        className="progressive-image thumb"
        alt={alt}
        src={thumb}
        //style={{ visibility: isLoaded ? 'hidden' : 'visible' }}
      />
      {isVisible && (
        <>
          {withInnerZoom ? (
            <InnerImageZoom
              fullscreenOnMobile={true}
              hideCloseButton={true}
              className="progressive-image full"
              alt={alt}
              src={src}
            />
          ) : (
            <img
              onLoad={() => setIsLoaded(true)}
              className="progressive-image full"
              style={{ opacity: isLoaded ? 1 : 0 }}
              alt={alt}
              src={src}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProgressiveImageContainer;
