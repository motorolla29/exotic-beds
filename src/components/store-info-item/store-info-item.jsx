import { Link } from 'react-router-dom';

import './store-info-item.sass';

const StoreInfoItem = () => {
  return (
    <div className="store-info-item">
      <div className="store-info-item_name">
        <p>Exotic Beds Store</p>
        <p>328.3 km</p>
      </div>
      <p className="store-info-item_address">Ruhlander Str. 100A</p>
      <p className="store-info-item_address">
        Schwarzheide, Sachsen, 01987, DE
      </p>
      <div className="store-info-item_work">
        <span className="store-info-item_work_status">Open</span>•
        <span className="store-info-item_work_description">
          Closes at 21:00
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10%"
          height="10%"
          viewBox="0 0 9.585 4.793"
        >
          <path
            id="B201"
            d="M9,13.5l4.793,4.793L18.585,13.5Z"
            transform="translate(-9 -14.5)"
            fill="#00363f"
          />
        </svg>
        <div className="store-info-item_work_calendar">
          <table className="store-info-item_work_calendar_table">
            <tbody>
              <tr className="store-info-item_work_calendar_table_row">
                <td className="store-info-item_work_calendar_table_row_day-data">
                  Monday
                </td>
                <td className="store-info-item_work_calendar_table_row_hrs-data">
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
                <td className="store-info-item_work_calendar_table_row_hrs-data">
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
                <td className="store-info-item_work_calendar_table_row_hrs-data">
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
                <td className="store-info-item_work_calendar_table_row_hrs-data">
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
                  className={`store-info-item_work_calendar_table_row_hrs-data ${'active'}`}
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
                <td className="store-info-item_work_calendar_table_row_hrs-data">
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
                <td className="store-info-item_work_calendar_table_row_hrs-data">
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
      </div>
      <div className="store-info-item_links">
        <Link className="store-info-item_links_directions">Get Directions</Link>
        <Link className="store-info-item_links_details">View Details</Link>
      </div>
    </div>
  );
};

export default StoreInfoItem;
