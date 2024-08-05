import { useEffect } from 'react';
import { MapProvider } from 'react-map-gl/maplibre';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import StoreFinder from '../../store-finder/store-finder';

import './store-finder-page.sass';

const StoreFinderPage = () => {
  window.scrollTo(0, 0);

  useEffect(() => {
    const chat = document.querySelector('.chat-container');
    if (chat) {
      chat.style.cssText = 'visibility: hidden';
    }
    return () => {
      if (chat) {
        chat.style.cssText = 'visibility: visible';
      }
    };
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
