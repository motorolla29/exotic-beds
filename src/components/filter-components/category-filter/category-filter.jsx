import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { PRODUCT_CATEGORIES } from '../../../const';
import { categoriesIds } from '../../../utils';

import './category-filter.sass';

const CategoryFilter = ({ counts = {} }) => {
  const [open, setOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategories = useMemo(
    () => searchParams.getAll('category'),
    [searchParams]
  );

  const handleToggle = (event) => {
    const cat = event.target.name;
    const existing = searchParams.getAll('category');

    searchParams.delete('category');
    const newValues = existing.includes(cat)
      ? existing.filter((c) => c !== cat)
      : [...existing, cat];

    newValues.forEach((c) => searchParams.append('category', c));
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

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
            {PRODUCT_CATEGORIES.map((cat, idx) => {
              const checked = activeCategories.includes(cat);
              const count = counts[categoriesIds[cat.toLowerCase()]] || 0;

              return (
                count > 0 && (
                  <div key={cat} className="category-filter_options_option">
                    <input
                      id={`category-${idx}`}
                      type="checkbox"
                      name={cat}
                      checked={checked}
                      onChange={handleToggle}
                      className="main-checkbox category-filter_options_option_input"
                    ></input>
                    <label htmlFor={`category-${idx}`}></label>
                    <span className="category-filter_options_option_name">
                      {cat}
                    </span>
                    <span className="category-filter_options_option_amount">
                      ({count})
                    </span>
                  </div>
                )
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryFilter;
