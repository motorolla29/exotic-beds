import { MapProvider } from 'react-map-gl/maplibre';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import StoreFinder from '../../store-finder/store-finder';

import './store-finder-page.sass';
import { useEffect } from 'react';

const StoreFinderPage = () => {
  window.scrollTo(0, 0);
  const chat = document.querySelector('.chat');
  useEffect(() => {
    chat.style.cssText = 'visibility: hidden';
    return () => (chat.style.cssText = 'visibility: visible');
  });

  return (
    <div className="store-finder-page">
      <Breadcrumbs />
      <MapProvider>
        <StoreFinder />
      </MapProvider>
    </div>
  );
};

export default StoreFinderPage;
