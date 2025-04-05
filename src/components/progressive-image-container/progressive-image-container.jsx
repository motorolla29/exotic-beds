import { useEffect, useRef, useState } from 'react';
import useIntersectionObserver from '../../hooks/use-intersection-observer';
import InnerImageZoom from 'react-inner-image-zoom';
import { isMobile } from 'detect-mobile';

import './progressive-image-container.sass';

const ProgressiveImageContainer = ({
  alt,
  thumb,
  src,
  defaultSrc,
  defaultThumbSrc,
  withInnerZoom = false,
}) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    if (withInnerZoom) {
      const isMobileDevice = isMobile();
      setIsLoaded(false);
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const { naturalWidth, naturalHeight } = img;
        const ratio =
          Math.min(naturalWidth, naturalHeight) /
          Math.max(naturalWidth, naturalHeight);
        let newZoom = Math.pow(ratio, 2);

        if (isMobileDevice) {
          // Ограничиваем зум, чтобы он входил в пределы экрана
          const maxZoomX = naturalWidth / window.innerWidth;
          const minZoomY = window.innerHeight / naturalHeight;

          if (naturalWidth > naturalHeight) {
            newZoom = Math.max(newZoom, minZoomY);
          } else {
            newZoom = Math.min(newZoom, maxZoomX);
          }
        }

        setZoomScale(newZoom);
        setIsLoaded(true);
      };
    }
  }, [src, withInnerZoom]);

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
        onError={(e) => {
          if (defaultThumbSrc) {
            e.target.src = defaultThumbSrc;
          }
        }}
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
              zoomScale={zoomScale}
            />
          ) : (
            <img
              onLoad={() => setIsLoaded(true)}
              onError={(e) => {
                if (defaultSrc) e.target.src = defaultSrc;
              }}
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
