import Map, {
  NavigationControl,
  GeolocateControl,
  FullscreenControl,
  AttributionControl,
  Marker,
  Popup,
} from 'react-map-gl/maplibre';

import MapPin from '../map-pin/map-pin';

import './store-finder-map.sass';
import { useState } from 'react';

const StoreFinderMap = () => {
  const [popupInfo, setPopupInfo] = useState(null);
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
    >
      <Marker
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
      </Marker>

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
