import { Link, useParams } from 'react-router-dom';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import stores from '../../../data/exotic-beds-stores';

import './store-page.sass';
import {
  getStoreWorkDescription,
  getStoreWorkStatus,
  sortStoresByProximity,
} from '../../../utils';
import { useEffect, useRef } from 'react';
import { MAPTILER_API_KEY } from '../../../const';
import { useMap } from 'react-map-gl/maplibre';

const StorePage = () => {
  const { id } = useParams();
  const store = stores.features.find((it) => it.properties.id === id);

  const localStoreMapRef = useRef();

  const nearbyStores = sortStoresByProximity(stores.features, {
    latitude: store.geometry.coordinates[1],
    longitude: store.geometry.coordinates[0],
  })
    .filter((it) => it.properties.id !== id)
    .slice(0, 3);

  useEffect(() => {
    window.scrollTo(0, 0);
    localStoreMapRef.current?.easeTo({
      center: store.geometry.coordinates,
      zoom: 16,
      essential: true,
      duration: 500,
    });
  }, [id]);
  return (
    <>
      <Breadcrumbs
        last={`${store.properties.name}, ${store.properties.address}, ${store.properties.city}`}
      />
      <div className="store-page">
        <img
          className="store-page_image"
          src={store.properties.photo}
          alt="store_photo"
        />
        <div className="store-page_info">
          <div className="store-page_info_header">
            <p className="store-page_info_header_name">{`${store.properties.name} ${store.properties.city}`}</p>
            <div className="store-page_info_header_work">
              <span
                className={`store-page_info_header_work_status ${
                  getStoreWorkStatus(store.properties.workCalendar)
                    ? 'open'
                    : 'closed'
                }`}
              >
                {getStoreWorkStatus(store.properties.workCalendar)
                  ? 'Open'
                  : 'Closed'}
              </span>
              •
              <span className="store-page_info_header_work_description">
                {getStoreWorkDescription(
                  getStoreWorkStatus(store.properties.workCalendar),
                  store.properties.workCalendar
                )}
              </span>
            </div>
          </div>
          <div className="store-page_info_body">
            <div className="store-page_info_body_address">
              <h2>Store address</h2>
              <p>{store.properties.address}</p>
              <p>{`${store.properties.city}, ${store.properties.postCode}, ${store.properties.countryCode}`}</p>
              <Link
                to={`https://maps.google.com?saddr=Current+Location&daddr=${store.geometry.coordinates[1]},${store.geometry.coordinates[0]}`}
                target="blank"
                className="store-page_info_body_address_directions-link"
              >
                Get Directions
              </Link>
            </div>

            <div className="store-page_info_body_opening-hours">
              <h2>Store opening hours</h2>
              <span>{`Monday: ${store.properties.workCalendar.Monday.open} - ${store.properties.workCalendar.Monday.close}`}</span>
              <span>{`Tuesday: ${store.properties.workCalendar.Tuesday.open} - ${store.properties.workCalendar.Tuesday.close}`}</span>
              <span>{`Wednesday: ${store.properties.workCalendar.Wednesday.open} - ${store.properties.workCalendar.Wednesday.close}`}</span>
              <span>{`Thursday: ${store.properties.workCalendar.Thursday.open} - ${store.properties.workCalendar.Thursday.close}`}</span>
              <span>{`Friday: ${store.properties.workCalendar.Friday.open} - ${store.properties.workCalendar.Friday.close}`}</span>
              <span>{`Saturday: ${store.properties.workCalendar.Saturday.open} - ${store.properties.workCalendar.Saturday.close}`}</span>
              <span>{`Sunday: ${store.properties.workCalendar.Sunday.open} - ${store.properties.workCalendar.Sunday.close}`}</span>
            </div>

            <Map
              ref={localStoreMapRef}
              attributionControl={false}
              initialViewState={{
                longitude: store.geometry.coordinates[0],
                latitude: store.geometry.coordinates[1],
                zoom: 16,
              }}
              mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_API_KEY}`}
            >
              <NavigationControl showCompass={false} />
              <Marker
                longitude={store.geometry.coordinates[0]}
                latitude={store.geometry.coordinates[1]}
                anchor="bottom"
                onClick={() => {
                  localStoreMapRef.current.easeTo({
                    center: store.geometry.coordinates,
                    zoom: 16,
                    essential: true,
                    duration: 1000,
                  });
                }}
              >
                <img
                  style={{ width: '60px' }}
                  src="/logo/EB-LOGO-NO-TEXT-HD.png"
                  alt="logo_pin"
                />
              </Marker>
            </Map>
          </div>
        </div>
        <div className="store-page_nearby-stores">
          <h1 className="store-page_nearby-stores_title">Nearby Stores</h1>
          <div className="store-page_nearby-stores_items">
            {nearbyStores.map((it) => {
              return (
                <div
                  key={it.properties.id}
                  className="store-page_nearby-stores_items_item"
                >
                  <Link to={`/store-finder/${it.properties.id}`}>
                    <img
                      className="store-page_nearby-stores_items_item_photo"
                      src={it.properties.photo}
                      alt="store_photo"
                    />
                    <h3>{`${it.properties.name} ${it.properties.city}`}</h3>
                    <p>{it.properties.address}</p>
                    <p>{`${it.properties.city}, ${it.properties.postCode}, ${it.properties.countryCode}`}</p>
                    <div className="store-page_nearby-stores_items_item_work">
                      <span
                        className={`store-page_nearby-stores_items_item_work_status ${
                          getStoreWorkStatus(it.properties.workCalendar)
                            ? 'opened'
                            : 'closed'
                        }`}
                      >
                        {getStoreWorkStatus(it.properties.workCalendar)
                          ? 'Open'
                          : 'Closed'}
                      </span>
                      •
                      <span className="store-page_nearby-stores_items_item_work_description">
                        {getStoreWorkDescription(
                          getStoreWorkStatus(it.properties.workCalendar),
                          it.properties.workCalendar
                        )}
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default StorePage;
