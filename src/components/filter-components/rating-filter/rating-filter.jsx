import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import RatingStars from '../../rating-stars/rating-stars';

import './rating-filter.sass';

const RatingFilter = ({ products }) => {
  const [open, setOpen] = useState(true);
  const [searchParams, setSearchparams] = useSearchParams();

  const onRatingInputChange = (evt) => {
    searchParams.set('minRating', evt.target.value);
    searchParams.set('page', 1);
    setSearchparams(searchParams);
  };

  return (
    <div className="rating-filter">
      <h5
        onClick={() => setOpen(!open)}
        className={`rating-filter_title ${open ? 'open' : 'hidden'}`}
      >
        Rating
      </h5>
      <AnimatePresence>
        {open && (
          <motion.div
            style={{ overflow: 'hidden' }}
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="rating-filter_options"
          >
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
              <span className="rating-filter_options_option_amount">
                ({products.filter((it) => it.rating >= 4).length})
              </span>
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
              <span className="rating-filter_options_option_amount">
                ({products.filter((it) => it.rating >= 3).length})
              </span>
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
              <span className="rating-filter_options_option_amount">
                ({products.filter((it) => it.rating >= 2).length})
              </span>
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
              <span className="rating-filter_options_option_amount">
                ({products.filter((it) => it.rating >= 1).length})
              </span>
            </div>
            <div className="rating-filter_options_option">
              <label className="main-radio">
                <input
                  type="radio"
                  name="rating"
                  value="0"
                  checked={searchParams.has('minRating', '0')}
                  onChange={onRatingInputChange}
                  className="main-radio"
                ></input>
                <span>Doesn't matter</span>
              </label>
              <span className="rating-filter_options_option_amount">
                ({products.length})
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RatingFilter;
