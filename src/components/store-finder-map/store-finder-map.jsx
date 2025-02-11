import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Map,
  Source,
  Layer,
  Popup,
  NavigationControl,
  GeolocateControl,
  FullscreenControl,
  AttributionControl,
} from 'react-map-gl/maplibre';

import { setMapViewState, setNearStoresCenter } from '../../store/action';
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
} from '../../map-layers';
import stores from '../../data/exotic-beds-stores.json';
import { getStoreWorkStatus } from '../../utils';
import { getStoreWorkDescription } from '../../utils';

import './store-finder-map.sass';

const StoreFinderMap = ({ onMapClick, popupInfo, showPopup, setShowPopup }) => {
  const mapRef = useRef();
  const dispatch = useDispatch();

  const viewState = useSelector((state) => state.mapViewState);

  const onMapLoad = useCallback(() => {
    const mapPin = new Image();
    mapPin.width = 248;
    mapPin.height = 150;
    mapPin.src = '/logo/EB-LOGO-NO-TEXT.svg';
    mapPin.onload = function (e) {
      mapRef.current.addImage('logo', mapPin);
    };
  }, []);

  const onMapMove = (event) => {
    dispatch(setMapViewState(event.viewState));
  };

  const onMapMouseMove = (event) => {
    const feature = event.features[0];
    if (feature) {
      mapRef.current.getCanvas().style.cursor = 'pointer';
    } else {
      mapRef.current.getCanvas().style.cursor = '';
    }
  };

  return (
    <Map
      {...viewState}
      id="storeFinderMap"
      mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.REACT_APP_MAPTILER_API_KEY}`}
      attributionControl={false}
      interactiveLayerIds={['clusters', 'unclustered-point']}
      onMove={onMapMove}
      onLoad={onMapLoad}
      onClick={onMapClick}
      onMouseMove={onMapMouseMove}
      ref={mapRef}
    >
      <Source
        id="stores"
        type="geojson"
        data={stores}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} />
      </Source>

      {showPopup && popupInfo && (
        <Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          anchor="bottom"
          className="store-finder-popup"
          closeOnClick={false}
          onClose={() => setShowPopup(false)}
        >
          <h3 className="store-finder-popup_name">{popupInfo.name}</h3>
          <p className="store-finder-popup_address">
            {popupInfo.address}, {popupInfo.city}, {popupInfo.region},{' '}
            {popupInfo.postCode}, {popupInfo.countryCode}
          </p>
          <div className="store-finder-popup_work">
            <span
              className={`store-finder-popup_work_status ${
                getStoreWorkStatus(popupInfo.workCalendar) ? 'opened' : 'closed'
              }`}
            >
              {getStoreWorkStatus(popupInfo.workCalendar) ? 'Open' : 'Closed'}
            </span>
            •
            <span className="store-finder-popup_work_description">
              {getStoreWorkDescription(
                getStoreWorkStatus(popupInfo.workCalendar),
                popupInfo.workCalendar
              )}
            </span>
          </div>
          <div className="store-finder-popup_links">
            <Link
              to={`https://maps.google.com?saddr=Current+Location&daddr=${popupInfo.latitude},${popupInfo.longitude}`}
              target="blank"
              className="store-finder-popup_links_directions"
            >
              Get Directions
            </Link>
            <Link
              to={`/store-finder/${popupInfo.id}`}
              className="store-finder-popup_links_details"
            >
              View Details
            </Link>
          </div>
        </Popup>
      )}

      <NavigationControl showCompass={false} />
      <GeolocateControl
        showAccuracyCircle={false}
        onGeolocate={(e) => {
          dispatch(
            setNearStoresCenter({
              latitude: e.coords.latitude,
              longitude: e.coords.longitude,
            })
          );
          mapRef.current.easeTo({
            center: [e.coords.longitude, e.coords.latitude],
            zoom: 12,
            essential: true,
            duration: 2000,
          });
        }}
      />
      <FullscreenControl />
      <AttributionControl
        customAttribution="Map design by motorolla29"
        compact
        style={{ color: '#004757a0', background: '#eefef664' }}
      />
    </Map>
  );
};

export default StoreFinderMap;
