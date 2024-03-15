import { PRODUCT_CATEGORIES } from '../../../const';

import './category-filter.sass';

const CategoryFilter = () => {
  return (
    <div className="category-filter">
      <div className="category-filter_options">
        {PRODUCT_CATEGORIES.map((category) => {
          return (
            <div key={category} className="category-filter_options_option">
              <input
                id={`category-${category}`}
                type="checkbox"
                className="main-checkbox category-filter_options_option_input"
              ></input>
              <label htmlFor={`category-${category}`}> </label>
              <span className="category-filter_options_option_name">
                {category}
              </span>
              <span className="category-filter_options_option_amount">
                (15)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
