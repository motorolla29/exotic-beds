import { Link } from 'react-router-dom';

import HeartIcon from '../heart-icon/heart-icon';

import './lovelist-empty.sass';

const LovelistEmpty = () => {
  return (
    <div className="lovelist-empty">
      <h2 className="lovelist-empty_title">Nothing in your lovelist yet</h2>
      <div className="lovelist-empty_subtitle">
        <span>
          To add products to your lovelist, go to the{' '}
          <Link to="/beds">catalog</Link>
        </span>
        <span>
          Click{' '}
          {
            <button className="catalog-item_info_ui_lovelist-button">
              <HeartIcon />
            </button>
          }{' '}
          on the product card and add what you like here.
        </span>
      </div>
    </div>
  );
};

export default LovelistEmpty;
