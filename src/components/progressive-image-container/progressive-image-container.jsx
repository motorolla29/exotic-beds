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
      setIsLoaded(false);
      const isMobileDevice = isMobile();
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const { naturalWidth, naturalHeight } = img;
        let newZoom = 1;

        if (!isMobileDevice) {
          // ПК: используем размеры контейнера (ref.current)
          if (ref.current) {
            const containerWidth = ref.current.offsetWidth;
            const containerHeight = ref.current.offsetHeight;

            // Если изображение меньше контейнера по любой из осей,
            // вычисляем масштаб, чтобы заполнить контейнер по наибольшему соотношению.
            if (
              naturalWidth < containerWidth ||
              naturalHeight < containerHeight
            ) {
              newZoom = Math.max(
                containerWidth / naturalWidth,
                containerHeight / naturalHeight
              );
            } else {
              // Если изображение больше или равно контейнеру, используем логику зума по соотношению сторон
              const ratio =
                Math.min(naturalWidth, naturalHeight) /
                Math.max(naturalWidth, naturalHeight);
              newZoom = Math.pow(ratio, 2);
            }
          }
        } else {
          // Мобильные устройства: размеры экрана
          const screenWidth = window.innerWidth;
          const screenHeight = window.innerHeight;

          // Если изображение меньше экрана, масштабируем, чтобы заполнить его по наибольшему соотношению
          if (naturalWidth < screenWidth || naturalHeight < screenHeight) {
            newZoom = Math.max(
              screenWidth / naturalWidth,
              screenHeight / naturalHeight
            );
          } else {
            // Если изображение больше экрана, используем исходную логику, с дополнительными ограничениями
            const ratio =
              Math.min(naturalWidth, naturalHeight) /
              Math.max(naturalWidth, naturalHeight);
            newZoom = Math.pow(ratio, 2);

            // Ограничиваем зум, чтобы изображение не выходило за пределы экрана
            const maxZoomX = naturalWidth / screenWidth;
            const minZoomY = screenHeight / naturalHeight;
            if (naturalWidth > naturalHeight) {
              newZoom = Math.max(newZoom, minZoomY);
            } else {
              newZoom = Math.min(newZoom, maxZoomX);
            }
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
