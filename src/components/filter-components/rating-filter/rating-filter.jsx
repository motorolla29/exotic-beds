import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import RatingStars from '../../rating-stars/rating-stars';

import './rating-filter.sass';

const RatingFilter = ({ counts = {} }) => {
  const [open, setOpen] = useState(true);
  const [searchParams, setSearchparams] = useSearchParams();

  const ratingOptions = [
    { value: 4, label: '& Up' },
    { value: 3, label: '& Up' },
    { value: 2, label: '& Up' },
    { value: 1, label: '& Up' },
    { value: 0, label: "Doesn't matter" },
  ];

  const getTotalCount = (minRating) => {
    if (!counts || typeof counts !== 'object') return 0;

    if (minRating === 0) {
      return (
        counts[0] ?? Object.values(counts).reduce((sum, val) => sum + val, 0)
      );
    }
    return Object.entries(counts)
      .filter(([rating]) => +rating >= minRating)
      .reduce((sum, [, count]) => sum + count, 0);
  };

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
            {ratingOptions.map(({ value, label }) => {
              const isChecked =
                searchParams.get('minRating') === value.toString();
              return (
                <div className="rating-filter_options_option" key={value}>
                  <label className="main-radio">
                    <input
                      type="radio"
                      name="rating"
                      value={value}
                      checked={isChecked}
                      onChange={onRatingInputChange}
                      className="main-radio"
                    />
                    <span>
                      {value > 0 ? (
                        <RatingStars id={value} rating={value} />
                      ) : (
                        "Doesn't matter"
                      )}
                    </span>
                    {value > 0 ? label : null}
                  </label>
                  <span className="rating-filter_options_option_amount">
                    ({getTotalCount(value)})
                  </span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RatingFilter;
