import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import './series-filter.sass';

const SeriesFilter = ({ counts = {} }) => {
  const [open, setOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const hasAnySeries = Object.values(counts).some((count) => count > 0);

  const handleChange = (evt) => {
    const { name } = evt.target;
    if (searchParams.has('series', name)) {
      searchParams.delete('series', name);
    } else {
      searchParams.append('series', name);
    }
    searchParams.set('page', 1);
    setSearchParams(searchParams);
  };

  return (
    (hasAnySeries || !!searchParams.has('series')) && (
      <div className="series-filter">
        <h5
          onClick={() => setOpen(!open)}
          className={`series-filter_title ${open ? 'open' : 'hidden'}`}
        >
          Series
        </h5>
        <AnimatePresence>
          {open && (
            <motion.div
              style={{ overflow: 'hidden' }}
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="series-filter_options"
            >
              {Object.entries(counts).map(([series, count]) => {
                const isChecked = searchParams
                  .getAll('series')
                  .includes(series);
                if (count > 0 || isChecked) {
                  return (
                    <div key={series} className="series-filter_options_option">
                      <input
                        id={`series-${series}`}
                        type="checkbox"
                        name={series}
                        checked={searchParams.getAll('series').includes(series)}
                        onChange={handleChange}
                        className="main-checkbox series-filter_options_option_input"
                      />
                      <label htmlFor={`series-${series}`} />
                      <span className="series-filter_options_option_name">
                        {series}
                      </span>
                      <span className="series-filter_options_option_amount">
                        ({count})
                      </span>
                    </div>
                  );
                }
                return null;
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  );
};

export default SeriesFilter;
