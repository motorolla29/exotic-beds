import { useSearchParams } from 'react-router-dom';

import RatingStars from '../../rating-stars/rating-stars';

import './rating-filter.sass';

const RatingFilter = () => {
  const [searchParams, setSearchparams] = useSearchParams();

  const onRatingInputChange = (evt) => {
    searchParams.set('minRating', evt.target.value);
    setSearchparams(searchParams);
  };

  return (
    <div className="rating-filter">
      <div className="rating-filter_options">
        <div className="rating-filter_options_option">
          <label className="main-radio">
            <input
              type="radio"
              name="rating"
              value="4"
              checked={searchParams.has('minRating', '4')}
              onChange={onRatingInputChange}
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
              value="3"
              checked={searchParams.has('minRating', '3')}
              onChange={onRatingInputChange}
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
              value="2"
              checked={searchParams.has('minRating', '2')}
              onChange={onRatingInputChange}
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
              value="1"
              checked={searchParams.has('minRating', '1')}
              onChange={onRatingInputChange}
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
              value="0"
              checked={searchParams.has('minRating', 'all')}
              onChange={onRatingInputChange}
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
