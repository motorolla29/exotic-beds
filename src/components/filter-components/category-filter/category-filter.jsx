import { useSearchParams } from 'react-router-dom';

import { PRODUCT_CATEGORIES } from '../../../const';

import './category-filter.sass';

const CategoryFilter = ({ products }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div className="category-filter">
      <div className="category-filter_options">
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
                        ? searchParams.delete('category', `${evt.target.name}`)
                        : searchParams.append('category', `${evt.target.name}`);
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
      </div>
    </div>
  );
};

export default CategoryFilter;
