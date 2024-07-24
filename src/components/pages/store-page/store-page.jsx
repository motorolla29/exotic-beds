import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import stores from '../../../data/exotic-beds-stores';

import './store-page.sass';
import { getStoreWorkDescription, getStoreWorkStatus } from '../../../utils';

const StorePage = () => {
  const { id } = useParams();
  const store = stores.features.find((it) => it.properties.id === id);

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
            <h1 className="store-page_info_header_name">{`${store.properties.name} ${store.properties.city}`}</h1>
            <div className="store-page_info_header_work">
              <span
                className={`store-page_info_work_status ${
                  getStoreWorkStatus(store.properties.workCalendar)
                    ? 'opened'
                    : 'closed'
                }`}
              >
                {getStoreWorkStatus(store.properties.workCalendar)
                  ? 'Open'
                  : 'Closed'}
              </span>
              •
              <span className="store-page_info_work_description">
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

            <div className="store-page_info_body_map">MAP</div>
          </div>
        </div>
        <div className="store-page_nearby-stores">
          <h1 className="store-page_nearby-stores_title">Nearby Stores</h1>
        </div>
      </div>
    </>
  );
};

export default StorePage;
