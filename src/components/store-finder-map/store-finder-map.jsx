import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useRef, useState } from 'react';
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

import { setMapViewState } from '../../store/action';
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
} from '../../map-layers';
import stores from '../../mocks/stores.geojson';

import './store-finder-map.sass';

const StoreFinderMap = () => {
  const mapRef = useRef();
  const dispatch = useDispatch();

  const viewState = useSelector((state) => state.mapViewState);

  const [popupInfo, setPopupInfo] = useState(null);
  const onMapLoad = useCallback(() => {
    const mapPin = new Image();
    mapPin.src = '/logo/EB-LOGO-NO-TEXT.svg';
    mapPin.onload = function (e) {
      mapRef.current.addImage('logo', e.target);
    };
  }, []);

  const onMapMove = (event) => {
    dispatch(setMapViewState(event.viewState));
  };
  const onMapClick = (event) => {
    const feature = event.features[0];
    if (feature) {
      if (feature.layer.id === 'unclustered-point') {
        setPopupInfo({
          ...feature.properties,
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1],
        });
        return;
      }
      if (feature.layer.id === 'clusters') {
        const clusterId = feature.properties.cluster_id;

        const mapboxSource = mapRef.current.getSource('stores');

        (async function () {
          const zoom = await mapboxSource.getClusterExpansionZoom(clusterId);
          if (!zoom) {
            return;
          }
          mapRef.current.easeTo({
            center: feature.geometry.coordinates,
            zoom: zoom,
            duration: 500,
          });
        })();
      }
    }
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
      mapStyle={
        'https://api.maptiler.com/maps/streets/style.json?key=JiORwzpLecOFb1wih0mU'
      }
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

      {popupInfo && (
        <Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          anchor="bottom"
          className="store-finder-popup"
          onClose={() => setPopupInfo(null)}
        >
          <div>
            <h3 className="store-finder-popup_name">{popupInfo.name}</h3>
            <p className="store-finder-popup_address">
              {popupInfo.address}, {popupInfo.city}, {popupInfo.region},{' '}
              {popupInfo.postCode}, {popupInfo.countryCode}
            </p>
            <div className="store-finder-popup_work">
              <span className="store-finder-popup_work_status">Open</span>•
              <span className="store-finder-popup_work_description">
                Closes at 21:00
              </span>
            </div>
          </div>
        </Popup>
      )}
      <NavigationControl showCompass={false} />
      <GeolocateControl showAccuracyCircle={false} />
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
