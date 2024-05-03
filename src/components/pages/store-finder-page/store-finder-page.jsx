import { MapProvider } from 'react-map-gl/maplibre';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import StoreFinder from '../../store-finder/store-finder';

import './store-finder-page.sass';

const StoreFinderPage = () => {
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
