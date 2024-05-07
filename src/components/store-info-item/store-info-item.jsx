import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import getDistance from 'geolib/es/getDistance';

import { getStoreWorkStatus } from '../../utils';
import { getStoreWorkDescription } from '../../utils';

import './store-info-item.sass';

const StoreInfoItem = ({ item, activeStoreId, onStoreItemClick }) => {
  const [workCalendarVisible, setWorkCalendarVisible] = useState(false);

  const centerCoords = useSelector((state) => state.nearStoresCenter);
  const storeDistance = getDistance(
    {
      latitude: item.geometry.coordinates[1],
      longitude: item.geometry.coordinates[0],
    },
    centerCoords
  );

  const dayNumber = new Date().getDay();

  const storeWorkStatus = getStoreWorkStatus(item.properties.workCalendar);

  const onWorkInfoClickHandler = (e) => {
    e.stopPropagation();
    setWorkCalendarVisible(!workCalendarVisible);
  };

  return (
    <div
      onClick={onStoreItemClick}
      className={`store-info-item ${
        activeStoreId === item.properties.id ? 'active' : ''
      }`}
    >
      <div className="store-info-item_name">
        <p>{item.properties.name}</p>
        <p>{(storeDistance / 1000).toFixed(2)} km</p>
      </div>
      <p className="store-info-item_address">{item.properties.address}</p>
      <p className="store-info-item_address">
        {item.properties.city}, {item.properties.country},{' '}
        {item.properties.postCode}
      </p>
      <div className="store-info-item_work">
        <div
          className="store-info-item_work_info"
          onClick={onWorkInfoClickHandler}
        >
          <span
            className={`store-info-item_work_info_status ${
              storeWorkStatus ? 'opened' : 'closed'
            }`}
          >
            {storeWorkStatus ? 'Opened' : 'Closed'}
          </span>
          •
          <span className="store-info-item_work_info_description">
            {getStoreWorkDescription(
              storeWorkStatus,
              item.properties.workCalendar
            )}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10%"
            height="10%"
            viewBox="0 0 9.585 4.793"
            className={workCalendarVisible ? 'active' : ''}
          >
            <path
              id="B201"
              d="M9,13.5l4.793,4.793L18.585,13.5Z"
              transform="translate(-9 -14.5)"
            />
          </svg>
        </div>
        {workCalendarVisible ? (
          <div className="store-info-item_work_calendar">
            <table className="store-info-item_work_calendar_table">
              <tbody>
                <tr className="store-info-item_work_calendar_table_row">
                  <td className="store-info-item_work_calendar_table_row_day-data">
                    Monday
                  </td>
                  <td
                    className={`store-info-item_work_calendar_table_row_hrs-data ${
                      dayNumber === 1 ? 'active' : 'null'
                    }`}
                  >
                    <span>
                      <span className="start-hrs">
                        {item.properties.workCalendar.Monday.open}
                      </span>
                      <span className="delimiter"> - </span>
                      <span className="end-hrs">
                        {item.properties.workCalendar.Monday.close}
                      </span>
                    </span>
                  </td>
                </tr>
                <tr className="store-info-item_work_calendar_table_row">
                  <td className="store-info-item_work_calendar_table_row_day-data">
                    Tuesday
                  </td>
                  <td
                    className={`store-info-item_work_calendar_table_row_hrs-data ${
                      dayNumber === 2 ? 'active' : 'null'
                    }`}
                  >
                    <span>
                      <span className="start-hrs">
                        {item.properties.workCalendar.Tuesday.open}
                      </span>
                      <span className="delimiter"> - </span>
                      <span className="end-hrs">
                        {item.properties.workCalendar.Tuesday.close}
                      </span>
                    </span>
                  </td>
                </tr>
                <tr className="store-info-item_work_calendar_table_row">
                  <td className="store-info-item_work_calendar_table_row_day-data">
                    Wednesday
                  </td>
                  <td
                    className={`store-info-item_work_calendar_table_row_hrs-data ${
                      dayNumber === 3 ? 'active' : 'null'
                    }`}
                  >
                    <span>
                      <span className="start-hrs">
                        {item.properties.workCalendar.Wednesday.open}
                      </span>
                      <span className="delimiter"> - </span>
                      <span className="end-hrs">
                        {item.properties.workCalendar.Wednesday.close}
                      </span>
                    </span>
                  </td>
                </tr>
                <tr className="store-info-item_work_calendar_table_row">
                  <td className="store-info-item_work_calendar_table_row_day-data">
                    Thursday
                  </td>
                  <td
                    className={`store-info-item_work_calendar_table_row_hrs-data ${
                      dayNumber === 4 ? 'active' : 'null'
                    }`}
                  >
                    <span>
                      <span className="start-hrs">
                        {item.properties.workCalendar.Thursday.open}
                      </span>
                      <span className="delimiter"> - </span>
                      <span className="end-hrs">
                        {item.properties.workCalendar.Thursday.close}
                      </span>
                    </span>
                  </td>
                </tr>
                <tr className="store-info-item_work_calendar_table_row">
                  <td className="store-info-item_work_calendar_table_row_day-data">
                    Friday
                  </td>
                  <td
                    className={`store-info-item_work_calendar_table_row_hrs-data ${
                      dayNumber === 5 ? 'active' : 'null'
                    }`}
                  >
                    <span>
                      <span className="start-hrs">
                        {item.properties.workCalendar.Friday.open}
                      </span>
                      <span className="delimiter"> - </span>
                      <span className="end-hrs">
                        {item.properties.workCalendar.Friday.close}
                      </span>
                    </span>
                  </td>
                </tr>
                <tr className="store-info-item_work_calendar_table_row">
                  <td className="store-info-item_work_calendar_table_row_day-data">
                    Saturday
                  </td>
                  <td
                    className={`store-info-item_work_calendar_table_row_hrs-data ${
                      dayNumber === 6 ? 'active' : 'null'
                    }`}
                  >
                    <span>
                      <span className="start-hrs">
                        {item.properties.workCalendar.Saturday.open}
                      </span>
                      <span className="delimiter"> - </span>
                      <span className="end-hrs">
                        {item.properties.workCalendar.Saturday.close}
                      </span>
                    </span>
                  </td>
                </tr>
                <tr className="store-info-item_work_calendar_table_row">
                  <td className="store-info-item_work_calendar_table_row_day-data">
                    Sunday
                  </td>
                  <td
                    className={`store-info-item_work_calendar_table_row_hrs-data ${
                      dayNumber === 0 ? 'active' : 'null'
                    }`}
                  >
                    <span>
                      <span className="start-hrs">
                        {item.properties.workCalendar.Sunday.open}
                      </span>
                      <span className="delimiter"> - </span>
                      <span className="end-hrs">
                        {item.properties.workCalendar.Sunday.close}
                      </span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
      <div className="store-info-item_links">
        <Link
          to={`https://maps.google.com?saddr=Current+Location&daddr=${item.geometry.coordinates[1]},${item.geometry.coordinates[0]}`}
          target="blank"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="store-info-item_links_directions"
        >
          Get Directions
        </Link>
        <Link
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="store-info-item_links_details"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default StoreInfoItem;
