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
        <div className="store-info-item_work_calendar"></div>
      </div>
      <div className="store-info-item_links">
        <Link className="store-info-item_links_directions">Get Directions</Link>
        <Link className="store-info-item_links_details">View Details</Link>
      </div>
    </div>
  );
};

export default StoreInfoItem;
