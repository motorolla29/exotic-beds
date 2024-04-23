import { useRef, useState } from 'react';
import {
  NavigationControl,
  GeolocateControl,
  FullscreenControl,
  AttributionControl,
  Marker,
  Popup,
} from 'react-map-gl/maplibre';
import { Map, Source, Layer } from 'react-map-gl/maplibre';

import MapPin from '../map-pin/map-pin';
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
} from '../../map-layers';
import stores from '../../mocks/stores.geojson';

import './store-finder-map.sass';

const StoreFinderMap = () => {
  const mapRef = useRef(null);
  const [popupInfo, setPopupInfo] = useState(null);

  const onMapClick = (event) => {
    const feature = event.features[0];
    const clusterId = feature?.properties?.cluster_id;

    const mapboxSource = mapRef.current.getSource('stores');

    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return;
      }

      mapRef.current.easeTo({
        center: feature.geometry.coordinates,
        zoom,
        duration: 500,
      });
    });
  };

  return (
    <Map
      initialViewState={{
        longitude: 37.676535192388165,
        latitude: 55.75839021438042,
        zoom: 8,
      }}
      mapStyle={
        'https://api.maptiler.com/maps/streets/style.json?key=JiORwzpLecOFb1wih0mU'
      }
      attributionControl={false}
      interactiveLayerIds={[clusterLayer.id]}
      onClick={onMapClick}
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
        <Layer
          id="unclustered-point"
          type="circle"
          source="stores"
          filter={['!', ['has', 'point_count']]}
          paint={{
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff',
          }}
        >
          <MapPin />
        </Layer>
      </Source>
      {/* <Marker
        longitude={37.38720655414402}
        latitude={55.811490987502005}
        anchor="top"
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          setPopupInfo({
            name: 'Exotic Beds Main Store',
            address:
              'MKAD, 66th kilometer, vl2, Krasnogorsk, Moscow region, 143402',
          });
        }}
      >
        <MapPin />
      </Marker> */}

      {popupInfo && (
        <Popup
          longitude={37.38720655414402}
          latitude={55.811490987502005}
          anchor="bottom"
          className="store-finder-popup"
          onClose={() => setPopupInfo(null)}
        >
          <div>
            <h3 className="store-finder-popup_name">{popupInfo.name}</h3>
            <p className="store-finder-popup_address">{popupInfo.address}</p>
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
