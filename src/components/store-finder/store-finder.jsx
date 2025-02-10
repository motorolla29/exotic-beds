import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useMap } from 'react-map-gl/maplibre';
import { GeocodingControl } from '@maptiler/geocoding-control/react';

import { setNearStoresCenter } from '../../store/action';
import StoreFinderMap from '../store-finder-map/store-finder-map';
import StoreInfoItem from '../store-info-item/store-info-item';
import stores from '../../data/exotic-beds-stores';
import useWindowSize from '../../hooks/use-window-size';
import { sortStoresByProximity } from '../../utils';

import '@maptiler/geocoding-control/style.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import './store-finder.sass';

const StoreFinder = () => {
  const dispatch = useDispatch();
  const centerCoords = useSelector((state) => state.nearStoresCenter);
  const [activeStore, setActiveStore] = useState();
  const [popupInfo, setPopupInfo] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const { storeFinderMap } = useMap();
  const [ww] = useWindowSize();
  const [locatorView, setLocatorView] = useState('map');

  const storesSortedByProximity = sortStoresByProximity(
    stores.features,
    centerCoords
  ).slice(0, 10);

  const onGeocoderItemPick = (event) => {
    if (event) {
      storeFinderMap.flyTo({
        center: { lat: event.center[1], lng: event.center[0] },
        zoom: 10,
        essential: true,
        duration: 2000,
      });
      dispatch(
        setNearStoresCenter({
          latitude: event.center[1],
          longitude: event.center[0],
        })
      );
    }
  };

  const onMapClick = (event) => {
    const feature = event.features[0];
    setShowPopup(false);
    setPopupInfo(null);
    if (feature) {
      if (feature.layer.id === 'unclustered-point') {
        setShowPopup(true);
        setActiveStore(feature);
        setPopupInfo({
          ...feature.properties,
          workCalendar: JSON.parse(feature.properties.workCalendar),
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1],
        });
        storeFinderMap.easeTo({
          center: feature.geometry.coordinates,
          essential: true,
          duration: 1000,
        });
        return;
      }
      if (feature.layer.id === 'clusters') {
        const clusterId = feature.properties.cluster_id;

        const mapboxSource = storeFinderMap.getSource('stores');

        (async function () {
          const zoom = await mapboxSource.getClusterExpansionZoom(clusterId);
          if (!zoom) {
            return;
          }
          storeFinderMap.easeTo({
            center: feature.geometry.coordinates,
            zoom: zoom,
            essential: true,
            duration: 1000,
          });
        })();
      }
    }
  };

  return (
    <div className="store-finder">
      <h1 className="store-finder_header">Find our Exotic store</h1>
      <div className="store-finder_geocoder">
        <GeocodingControl
          apiKey={process.env.MAPTILER_API_KEY}
          onPick={onGeocoderItemPick}
        />
      </div>
      {ww <= 768 ? (
        <div className="store-finder_map-to-list-switcher">
          <div
            onClick={() => setLocatorView('map')}
            className={`store-finder_map-to-list-switcher_map ${
              locatorView === 'map' ? 'active' : ''
            }`}
          >
            Map
          </div>
          <div
            onClick={() => setLocatorView('list')}
            className={`store-finder_map-to-list-switcher_list ${
              locatorView === 'list' ? 'active' : ''
            }`}
          >
            List
          </div>
        </div>
      ) : null}

      <div className="store-finder_locator">
        {ww >= 768 || locatorView === 'list' ? (
          <OverlayScrollbarsComponent
            className="store-finder_locator_list"
            defer
          >
            <div className="store-finder_locator_list_header">
              <p className="store-finder_locator_list_header_counter">
                {storesSortedByProximity.length} Stores Near You
              </p>
            </div>
            <div className="store-finder_locator_list_store-info-items">
              {storesSortedByProximity.map((it) => {
                return (
                  <StoreInfoItem
                    onStoreItemClick={() => {
                      setActiveStore(it);
                      storeFinderMap?.flyTo({
                        center: [
                          it.geometry.coordinates[0],
                          it.geometry.coordinates[1],
                        ],
                        zoom: 16,
                        essential: true,
                        duration: 2000,
                      });
                      setPopupInfo({
                        ...it.properties,
                        longitude: it.geometry.coordinates[0],
                        latitude: it.geometry.coordinates[1],
                      });
                    }}
                    key={it.properties.id}
                    item={it}
                    activeStoreId={activeStore?.properties.id}
                  />
                );
              })}
            </div>
          </OverlayScrollbarsComponent>
        ) : null}
        {ww >= 768 || locatorView === 'map' ? (
          <div className="store-finder_locator_map">
            <StoreFinderMap
              onMapClick={onMapClick}
              popupInfo={popupInfo}
              showPopup={showPopup}
              setShowPopup={setShowPopup}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StoreFinder;
