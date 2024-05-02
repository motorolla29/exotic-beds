import { useSelector } from 'react-redux';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { MapProvider } from 'react-map-gl';
import getDistance from 'geolib/es/getDistance';

import StoreFinderMap from '../store-finder-map/store-finder-map';
import StoreInfoItem from '../store-info-item/store-info-item';

import stores from '../../mocks/stores';

import 'maplibre-gl/dist/maplibre-gl.css';
import './store-finder.sass';

const StoreFinder = () => {
  const centerCoords = useSelector((state) => state.nearStoresCenter);
  const storesSortedByProximity = stores.features.sort(function (a, b) {
    if (
      getDistance(
        {
          latitude: a.geometry.coordinates[1],
          longitude: a.geometry.coordinates[0],
        },
        centerCoords
      ) >
      getDistance(
        {
          latitude: b.geometry.coordinates[1],
          longitude: b.geometry.coordinates[0],
        },
        centerCoords
      )
    ) {
      return 1;
    }
    if (
      getDistance(
        {
          latitude: a.geometry.coordinates[1],
          longitude: a.geometry.coordinates[0],
        },
        centerCoords
      ) <
      getDistance(
        {
          latitude: b.geometry.coordinates[1],
          longitude: b.geometry.coordinates[0],
        },
        centerCoords
      )
    ) {
      return -1;
    }
    return 0;
  });
  console.log(storesSortedByProximity);

  return (
    <div className="store-finder">
      <div className="store-finder_header">
        <h1 className="store-finder_header_title">Find our Exotic store</h1>
        <p className="store-finder_header_subtitle">
          We have more than 100 stores around the world, find the nearest one
          and come visit
        </p>
        <div className="store-finder_header_finder">find</div>
      </div>
      <div className="store-finder_locator">
        <OverlayScrollbarsComponent className="store-finder_locator_list" defer>
          <div className="store-finder_locator_list_header">
            <p className="store-finder_locator_list_header_counter">
              10 Stores Near You
            </p>
          </div>
          <div className="store-finder_locator_list_store-info-items">
            {storesSortedByProximity.slice(0, 10).map((it) => {
              return <StoreInfoItem key={it.properties.id} item={it} />;
            })}
          </div>
        </OverlayScrollbarsComponent>
        <div className="store-finder_locator_map">
          <MapProvider>
            <StoreFinderMap />
          </MapProvider>
        </div>
      </div>
    </div>
  );
};

export default StoreFinder;
