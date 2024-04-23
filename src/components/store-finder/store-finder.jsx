import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

import StoreFinderMap from '../store-finder-map/store-finder-map';
import StoreInfoItem from '../store-info-item/store-info-item';

import 'maplibre-gl/dist/maplibre-gl.css';
import './store-finder.sass';

const StoreFinder = () => {
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
            <StoreInfoItem />
            <StoreInfoItem />
            <StoreInfoItem />
            <StoreInfoItem />
            <StoreInfoItem />
          </div>
        </OverlayScrollbarsComponent>
        <div className="store-finder_locator_map">
          <StoreFinderMap />
        </div>
      </div>
    </div>
  );
};

export default StoreFinder;