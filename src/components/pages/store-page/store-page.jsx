import { useEffect, useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { Helmet } from 'react-helmet-async';

import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import stores from '../../../data/exotic-beds-stores';
import {
  getStoreWorkDescription,
  getStoreWorkStatus,
  sortStoresByProximity,
} from '../../../utils';
import ProgressiveImageContainer from '../../progressive-image-container/progressive-image-container';
import { ReactComponent as MapPinIcon } from '../../../images/map-pin-icon.svg';
import { ReactComponent as ClockIcon } from '../../../images/clock-icon.svg';

import './store-page.sass';

const StorePage = () => {
  const { id } = useParams();

  const store = stores.features.find((it) => it.properties.id === id);

  const dayNumber = new Date().getDay();
  const localStoreMapRef = useRef();
  const nearbyStoresScrollbarRef = useRef(null);

  const nearbyStores = store?.geometry
    ? sortStoresByProximity(stores.features, {
        latitude: store?.geometry?.coordinates[1],
        longitude: store?.geometry?.coordinates[0],
      })
        .filter((it) => it.properties.id !== id)
        .slice(0, 3)
    : [];

  useEffect(() => {
    window.scrollTo(0, 0);
    localStoreMapRef.current?.easeTo({
      center: store.geometry.coordinates,
      zoom: 16,
      essential: true,
      duration: 500,
    });

    if (nearbyStoresScrollbarRef.current) {
      const instance = nearbyStoresScrollbarRef.current.osInstance();
      instance?.elements().viewport.scroll(0, 0);
    } // сброс скролла в блоке с ближайшими магазинами
  }, [store]);

  if (!store?.geometry || !store?.properties) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <>
      <Helmet>
        <title>
          {store.properties.name ? store.properties.name : ''}{' '}
          {store.properties.city ? store.properties.city : ''}
        </title>
      </Helmet>
      <Breadcrumbs
        last={`${store.properties.name}, ${store.properties.address}, ${store.properties.city}`}
      />
      <div className="store-page" key={store.properties.id}>
        <div className="store-page_store-image">
          <ProgressiveImageContainer
            thumb={`https://ik.imagekit.io/motorolla29/exotic-beds/stores/${store.properties.photo}?tr=w-60`}
            src={`https://ik.imagekit.io/motorolla29/exotic-beds/stores/${store.properties.photo}`}
            alt="store-image"
          />
        </div>
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
            <div className="store-page_info_body_details">
              <div className="store-page_info_body_details_address">
                <h2>
                  <MapPinIcon />
                  Store address
                </h2>
                <p>{store.properties.address}</p>
                <p>{`${store.properties.city}, ${store.properties.country}, ${store.properties.postCode}`}</p>
                <div className="store-page_info_body_details_address_directions-link">
                  <Link
                    to={`https://maps.google.com?saddr=Current+Location&daddr=${store.geometry.coordinates[1]},${store.geometry.coordinates[0]}`}
                    target="blank"
                  >
                    Get Directions
                  </Link>
                </div>
              </div>

              <div className="store-page_info_body_details_opening-hours">
                <h2>
                  <ClockIcon />
                  Store opening hours
                </h2>
                <p className={`${dayNumber === 1 ? 'active' : ''}`}>
                  <span>Monday: </span>
                  {`${store.properties.workCalendar.Monday.open} - ${store.properties.workCalendar.Monday.close}`}
                </p>
                <p className={`${dayNumber === 2 ? 'active' : ''}`}>
                  <span>Tuesday: </span>
                  {`${store.properties.workCalendar.Tuesday.open} - ${store.properties.workCalendar.Tuesday.close}`}
                </p>
                <p className={`${dayNumber === 3 ? 'active' : ''}`}>
                  <span>Wednesday: </span>
                  {`${store.properties.workCalendar.Wednesday.open} - ${store.properties.workCalendar.Wednesday.close}`}
                </p>
                <p className={`${dayNumber === 4 ? 'active' : ''}`}>
                  <span>Thursday: </span>
                  {`${store.properties.workCalendar.Thursday.open} - ${store.properties.workCalendar.Thursday.close}`}
                </p>
                <p className={`${dayNumber === 5 ? 'active' : ''}`}>
                  <span>Friday: </span>
                  {`${store.properties.workCalendar.Friday.open} - ${store.properties.workCalendar.Friday.close}`}
                </p>
                <p className={`${dayNumber === 6 ? 'active' : ''}`}>
                  <span>Saturday: </span>
                  {`${store.properties.workCalendar.Saturday.open} - ${store.properties.workCalendar.Saturday.close}`}
                </p>
                <p className={`${dayNumber === 0 ? 'active' : ''}`}>
                  <span>Sunday: </span>
                  {`${store.properties.workCalendar.Sunday.open} - ${store.properties.workCalendar.Sunday.close}`}
                </p>
              </div>
            </div>

            <div className="store-page_info_body_map-container">
              <Map
                ref={localStoreMapRef}
                attributionControl={false}
                initialViewState={{
                  longitude: store.geometry.coordinates[0],
                  latitude: store.geometry.coordinates[1],
                  zoom: 16,
                }}
                mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.REACT_APP_MAPTILER_API_KEY}`}
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
                    src="https://ik.imagekit.io/motorolla29/exotic-beds/logo/EB-LOGO-NO-TEXT-HD.png"
                    alt="logo_pin"
                  />
                </Marker>
              </Map>
            </div>
          </div>
        </div>
        <div className="store-page_nearby-stores">
          <h1 className="store-page_nearby-stores_title">Nearby Stores</h1>
          <OverlayScrollbarsComponent
            id="nearby-stores-scrollbar"
            ref={nearbyStoresScrollbarRef}
            defer
          >
            <div className="store-page_nearby-stores_items">
              {nearbyStores.map((it) => {
                return (
                  <div
                    key={it.properties.id}
                    className="store-page_nearby-stores_items_item"
                  >
                    <Link to={`/store-finder/${it.properties.id}`}>
                      <div className="store-page_nearby-stores_items_item_image">
                        <ProgressiveImageContainer
                          thumb={`https://ik.imagekit.io/motorolla29/exotic-beds/stores/${it.properties.photo}?tr=w-40`}
                          src={`https://ik.imagekit.io/motorolla29/exotic-beds/stores/${it.properties.photo}?tr=w-500`}
                          alt="store-image"
                        />
                      </div>
                      <h3>{`${it.properties.name} ${it.properties.city}`}</h3>
                      <p>{it.properties.address}</p>
                      <p>{`${it.properties.country}, ${it.properties.city}, ${it.properties.postCode}`}</p>
                      <div className="store-page_nearby-stores_items_item_work">
                        <span
                          className={`store-page_nearby-stores_items_item_work_status ${
                            getStoreWorkStatus(it.properties.workCalendar)
                              ? 'open'
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
          </OverlayScrollbarsComponent>
        </div>
      </div>
    </>
  );
};

export default StorePage;
