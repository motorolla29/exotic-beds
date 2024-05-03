import { useSelector } from 'react-redux';
import { useState } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useMap } from 'react-map-gl/maplibre';
import getDistance from 'geolib/es/getDistance';

import StoreFinderMap from '../store-finder-map/store-finder-map';
import StoreInfoItem from '../store-info-item/store-info-item';

import stores from '../../mocks/stores';

import 'maplibre-gl/dist/maplibre-gl.css';
import './store-finder.sass';

const StoreFinder = () => {
  const centerCoords = useSelector((state) => state.nearStoresCenter);
  const [activeStore, setActiveStore] = useState();
  const [popupInfo, setPopupInfo] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const { storeFinderMap } = useMap();

  const storesSortedByProximity = stores.features
    .sort(function (a, b) {
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
    })
    .slice(0, 10);

  const onMapClick = (event) => {
    const feature = event.features[0];
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
              {storesSortedByProximity.length} Stores Near You
            </p>
          </div>
          <div className="store-finder_locator_list_store-info-items">
            {storesSortedByProximity.map((it) => {
              return (
                <StoreInfoItem
                  onStoreItemClick={() => {
                    setActiveStore(it);
                    storeFinderMap.flyTo({
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
        <div className="store-finder_locator_map">
          <StoreFinderMap
            onMapClick={onMapClick}
            popupInfo={popupInfo}
            showPopup={showPopup}
            setShowPopup={setShowPopup}
          />
        </div>
      </div>
    </div>
  );
};

export default StoreFinder;
