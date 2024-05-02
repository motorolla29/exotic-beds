import { Link } from 'react-router-dom';
import { useState } from 'react';
import getDistance from 'geolib/es/getDistance';

import './store-info-item.sass';
import { useSelector } from 'react-redux';

const StoreInfoItem = ({ item }) => {
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

  const onWorkInfoClickHandler = () =>
    setWorkCalendarVisible(!workCalendarVisible);

  return (
    <div className="store-info-item">
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
          <span className="store-info-item_work_info_status">Open</span>•
          <span className="store-info-item_work_info_description">
            Closes at 21:00
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
                      <span className="start-hrs">10:00</span>
                      <span className="delimiter"> - </span>
                      <span className="end-hrs">21:00</span>
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
                      <span className="start-hrs">10:00</span>
                      <span className="delimiter"> - </span>
                      <span className="end-hrs">21:00</span>
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
                      <span className="start-hrs">10:00</span>
                      <span className="delimiter"> - </span>
                      <span className="end-hrs">21:00</span>
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
                      <span className="start-hrs">10:00</span>
                      <span className="delimiter"> - </span>
                      <span className="end-hrs">21:00</span>
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
                      <span className="start-hrs">10:00</span>
                      <span className="delimiter"> - </span>
                      <span className="end-hrs">21:00</span>
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
                      <span className="start-hrs">10:00</span>
                      <span className="delimiter"> - </span>
                      <span className="end-hrs">21:00</span>
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
                      <span className="start-hrs">10:00</span>
                      <span className="delimiter"> - </span>
                      <span className="end-hrs">21:00</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
      <div className="store-info-item_links">
        <Link className="store-info-item_links_directions">Get Directions</Link>
        <Link className="store-info-item_links_details">View Details</Link>
      </div>
    </div>
  );
};

export default StoreInfoItem;
