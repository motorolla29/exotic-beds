import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { PRODUCT_SERIES } from '../../../const';

import './series-filter.sass';

const SeriesFilter = ({ products }) => {
  const [open, setOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const isSerialProducts = products.find((it) =>
    it.title.toLowerCase().includes('series')
  );

  return (
    isSerialProducts && (
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
              {PRODUCT_SERIES.map((series) => {
                const count = products.filter((it) =>
                  it.title
                    .toLowerCase()
                    .includes(`${series.toLowerCase()} series`)
                ).length;

                return (
                  <div key={series}>
                    {count ? (
                      <div className="series-filter_options_option">
                        <input
                          id={`series-${series}`}
                          type="checkbox"
                          name={series}
                          checked={searchParams.has('series', `${series}`)}
                          onChange={(evt) => {
                            searchParams.has('series', `${series}`)
                              ? searchParams.delete(
                                  'series',
                                  `${evt.target.name}`
                                )
                              : searchParams.append(
                                  'series',
                                  `${evt.target.name}`
                                );
                            searchParams.set('page', 1);
                            setSearchParams(searchParams);
                          }}
                          className="main-checkbox series-filter_options_option_input"
                        ></input>
                        <label htmlFor={`series-${series}`} />
                        <span className="series-filter_options_option_name">
                          {series}
                        </span>
                        <span className="series-filter_options_option_amount">
                          ({count})
                        </span>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  );
};

export default SeriesFilter;
