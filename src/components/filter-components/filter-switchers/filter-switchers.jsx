import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import './filter-switchers.sass';

const FilterSwitchers = ({ newCount, saleCount, topRatedCount }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isTopRated, setIsTopRated] = useState(searchParams.has('top-rated'));
  const [isSale, setIsSale] = useState(searchParams.has('sale'));
  const [isNew, setIsNew] = useState(searchParams.has('new'));

  useEffect(() => {
    setIsTopRated(searchParams.has('top-rated'));
    setIsSale(searchParams.has('sale'));
    setIsNew(searchParams.has('new'));
  }, [searchParams]);

  const handleToggle = (evt, name, setter) => {
    const checked = evt.target.checked;
    setter(checked);
    checked ? searchParams.set(name, true) : searchParams.delete(name);
    searchParams.set('page', 1);
    setSearchParams(searchParams);
  };

  return (
    <div className="filter-switchers">
      {(topRatedCount > 0 || isTopRated) && (
        <div className="filter-switchers_top-rated">
          <span className="filter-switchers_top-rated_name">
            Top rated only
          </span>
          <label className="main-switch" htmlFor="top-rated-switch">
            <input
              onChange={(e) => handleToggle(e, 'top-rated', setIsTopRated)}
              type="checkbox"
              name="top-rated"
              checked={isTopRated}
              id="top-rated-switch"
            />
            <div className="main-slider round" />
          </label>
        </div>
      )}
      {(saleCount > 0 || isSale) && (
        <div className="filter-switchers_sale">
          <span className="filter-switchers_sale_name">On sale only</span>
          <label className="main-switch" htmlFor="sale-switch">
            <input
              onChange={(e) => handleToggle(e, 'sale', setIsSale)}
              type="checkbox"
              name="sale"
              checked={isSale}
              id="sale-switch"
            />
            <div className="main-slider round" />
          </label>
        </div>
      )}
      {(newCount > 0 || isNew) && (
        <div className="filter-switchers_new">
          <span className="filter-switchers_new_name">New only</span>
          <label className="main-switch" htmlFor="new-switch">
            <input
              onChange={(e) => handleToggle(e, 'new', setIsNew)}
              type="checkbox"
              name="new"
              checked={isNew}
              id="new-switch"
            />
            <div className="main-slider round" />
          </label>
        </div>
      )}
    </div>
  );
};

export default FilterSwitchers;
