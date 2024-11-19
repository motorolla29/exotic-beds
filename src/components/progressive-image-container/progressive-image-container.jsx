import { useEffect, useRef, useState } from 'react';
import useIntersectionObserver from '../../hooks/use-intersection-observer';

import './progressive-image-container.sass';
import InnerImageZoom from 'react-inner-image-zoom';

const ProgressiveImage = ({ alt, thumb, src, withInnerZoom = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(false);
  }, [src]);
  return (
    <>
      <img
        className="progressive-image thumb"
        alt={alt}
        src={thumb}
        style={{ visibility: isLoaded ? 'hidden' : 'visible' }}
      />
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
          onLoad={() => {
            setIsLoaded(true);
          }}
          className="progressive-image full"
          style={{ opacity: isLoaded ? 1 : 0 }}
          alt={alt}
          src={src}
        />
      )}
    </>
  );
};

const ProgressiveImageContainer = ({ alt, thumb, src, withInnerZoom }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);
  // useEffect(() => {
  //   setIsVisible(false);
  // }, [src]);

  useIntersectionObserver({
    target: ref,
    onIntersect: ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        setIsVisible(true);
        observerElement.unobserve(ref.current);
      }
    },
  });

  return (
    <div ref={ref} className="progressive-image-container">
      {isVisible && (
        <ProgressiveImage
          src={src}
          thumb={thumb}
          alt={alt}
          withInnerZoom={withInnerZoom}
        />
      )}
    </div>
  );
};

export default ProgressiveImageContainer;
