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
      initialViewState={{
        longitude: 37.676535192388165,
        latitude: 55.75839021438042,
        zoom: 8,
      }}
      mapStyle={
        'https://api.maptiler.com/maps/streets/style.json?key=JiORwzpLecOFb1wih0mU'
      }
      attributionControl={false}
      interactiveLayerIds={['clusters', 'unclustered-point']}
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
        <Layer
          id="clusters"
          type="circle"
          source="stores"
          filter={['has', 'point_count']}
          paint={{
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              100,
              '#f1f075',
              750,
              '#f28cb1',
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40,
            ],
          }}
        />
        <Layer
          id="cluster-count"
          type="symbol"
          source="stores"
          filter={['has', 'point_count']}
          layout={{
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12,
          }}
        />
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
        />
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
