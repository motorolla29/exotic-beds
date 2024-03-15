import RatingStars from '../../rating-stars/rating-stars';

import './rating-filter.sass';

const RatingFilter = () => {
  return (
    <div className="rating-filter">
      <div className="rating-filter_options">
        <div className="rating-filter_options_option">
          <label className="main-radio">
            <input
              type="radio"
              name="rating"
              value="4+"
              className="main-radio"
            ></input>
            <span>
              <RatingStars id={4} rating={4} />
            </span>
            & Up
          </label>
          <span className="rating-filter_options_option_amount">(15)</span>
        </div>
        <div className="rating-filter_options_option">
          <label className="main-radio">
            <input
              type="radio"
              name="rating"
              value="3+"
              className="main-radio"
            ></input>
            <span>
              <RatingStars id={3} rating={3} />
            </span>
            & Up
          </label>
          <span className="rating-filter_options_option_amount">(15)</span>
        </div>
        <div className="rating-filter_options_option">
          <label className="main-radio">
            <input
              type="radio"
              name="rating"
              value="2+"
              className="main-radio"
            ></input>
            <span>
              <RatingStars id={2} rating={2} />
            </span>
            & Up
          </label>
          <span className="rating-filter_options_option_amount">(15)</span>
        </div>
        <div className="rating-filter_options_option">
          <label className="main-radio">
            <input
              type="radio"
              name="rating"
              value="1+"
              className="main-radio"
            ></input>
            <span>
              <RatingStars id={1} rating={1} />
            </span>
            & Up
          </label>
          <span className="rating-filter_options_option_amount">(15)</span>
        </div>
        <div className="rating-filter_options_option">
          <label className="main-radio">
            <input
              type="radio"
              name="rating"
              value="all"
              className="main-radio"
            ></input>
            <span>Doesn't matter</span>
          </label>
          <span className="rating-filter_options_option_amount">(15)</span>
        </div>
      </div>
    </div>
  );
};

export default RatingFilter;
