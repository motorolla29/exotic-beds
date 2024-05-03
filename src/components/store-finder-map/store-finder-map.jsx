import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useMap,
  Map,
  Source,
  Layer,
  Popup,
  NavigationControl,
  GeolocateControl,
  FullscreenControl,
  AttributionControl,
} from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import { GeocodingControl } from '@maptiler/geocoding-control/react';
import { createMapLibreGlMapController } from '@maptiler/geocoding-control/maplibregl-controller';

import { setMapViewState } from '../../store/action';
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
} from '../../map-layers';
import stores from '../../mocks/stores.json';

import '@maptiler/geocoding-control/style.css';
import './store-finder-map.sass';

const StoreFinderMap = () => {
  const mapRef = useRef();
  const dispatch = useDispatch();

  const API_KEY = 'JiORwzpLecOFb1wih0mU';

  // const { storeFinderMap } = useMap();

  const viewState = useSelector((state) => state.mapViewState);

  const [popupInfo, setPopupInfo] = useState();

  // const [mapController, setMapController] = useState();

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
            essential: true,
            duration: 1000,
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

  // useEffect(() => {
  //   if (!mapRef.current) {
  //     return;
  //   }
  //   console.log(storeFinderMap);
  //   storeFinderMap.addControl(new maplibregl.NavigationControl(), 'top-right');
  //   setMapController(createMapLibreGlMapController(storeFinderMap, maplibregl));
  //   console.log(mapController);
  // }, []);

  return (
    <Map
      {...viewState}
      id="storeFinderMap"
      mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${API_KEY}`}
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
          onClose={() => {
            setPopupInfo(null);
          }}
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
      <div
        style={{ position: 'absolute', top: '10px', left: '10px' }}
        className="geocoding"
      >
        <GeocodingControl
          apiKey={API_KEY}
          // mapController={mapController}
          // onPick={(e) => console.log(e)}
        />
      </div>
      <NavigationControl showCompass={false} />
      <GeolocateControl
        showAccuracyCircle={false}
        onGeolocate={(e) => {
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
