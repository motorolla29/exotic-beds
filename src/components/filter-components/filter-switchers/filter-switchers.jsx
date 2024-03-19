import { useSearchParams } from 'react-router-dom';
import './filter-switchers.sass';
import { useEffect, useState } from 'react';

const FilterSwitchers = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setInputNameToUrlParamsBool = (evt, params) => {
    evt.target.checked
      ? searchParams.append(evt.target.name, true)
      : searchParams.delete(evt.target.name);
    setSearchParams(params);
  };

  const [isTopRated, setIsTopRated] = useState(searchParams.has('top-rated'));
  const [isSale, setIsSale] = useState(searchParams.has('sale'));
  const [isNew, setIsNew] = useState(searchParams.has('new'));

  const onInputTopRatedSwitcherHandler = (evt) => {
    setIsTopRated(evt.target.checked);
    setInputNameToUrlParamsBool(evt, searchParams);
  };
  const onInputSaleSwitcherHandler = (evt) => {
    setIsSale(evt.target.checked);
    setInputNameToUrlParamsBool(evt, searchParams);
  };
  const onInputNewSwitcherHandler = (evt) => {
    setIsNew(evt.target.checked);
    setInputNameToUrlParamsBool(evt, searchParams);
  };

  return (
    <div className="filter-switchers">
      <div className="filter-switchers_top-rated">
        <span className="filter-switchers_top-rated_name">Top rated only</span>
        <label className="main-switch" htmlFor="top-rated-switch">
          <input
            onChange={onInputTopRatedSwitcherHandler}
            type="checkbox"
            name="top-rated"
            checked={isTopRated}
            id="top-rated-switch"
          />
          <div className="main-slider round"></div>
        </label>
      </div>
      <div className="filter-switchers_sale">
        <span className="filter-switchers_sale_name">On sale only</span>
        <label className="main-switch" htmlFor="sale-switch">
          <input
            onChange={onInputSaleSwitcherHandler}
            type="checkbox"
            name="sale"
            checked={isSale}
            id="sale-switch"
          />
          <div className="main-slider round"></div>
        </label>
      </div>
      <div className="filter-switchers_new">
        <span className="filter-switchers_new_name">New only</span>
        <label className="main-switch" htmlFor="new-switch">
          <input
            onChange={onInputNewSwitcherHandler}
            type="checkbox"
            name="new"
            checked={isNew}
            id="new-switch"
          />
          <div className="main-slider round"></div>
        </label>
      </div>
    </div>
  );
};

export default FilterSwitchers;
