import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { PRODUCT_CATEGORIES } from '../../../const';

import './category-filter.sass';

const CategoryFilter = ({ products }) => {
  const [open, setOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div className="category-filter">
      <h5
        onClick={() => setOpen(!open)}
        className={`category-filter_title ${open ? 'open' : 'hidden'}`}
      >
        Category
      </h5>
      <AnimatePresence>
        {open && (
          <motion.div
            style={{ overflow: 'hidden' }}
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="category-filter_options"
          >
            {PRODUCT_CATEGORIES.map((category) => {
              const count = products.filter(
                (it) => it.category.toLowerCase() === category.toLowerCase()
              ).length;

              return (
                <div key={category}>
                  {count ? (
                    <div className="category-filter_options_option">
                      <input
                        id={`category-${category}`}
                        type="checkbox"
                        name={category}
                        checked={searchParams.has('category', `${category}`)}
                        onChange={(evt) => {
                          searchParams.has('category', `${category}`)
                            ? searchParams.delete(
                                'category',
                                `${evt.target.name}`
                              )
                            : searchParams.append(
                                'category',
                                `${evt.target.name}`
                              );
                          searchParams.set('page', 1);
                          setSearchParams(searchParams);
                        }}
                        className="main-checkbox category-filter_options_option_input"
                      ></input>
                      <label htmlFor={`category-${category}`}></label>
                      <span className="category-filter_options_option_name">
                        {category}
                      </span>
                      <span className="category-filter_options_option_amount">
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
  );
};

export default CategoryFilter;
