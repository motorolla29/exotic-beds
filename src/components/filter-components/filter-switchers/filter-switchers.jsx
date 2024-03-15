import './filter-switchers.sass';

const FilterSwitchers = () => {
  return (
    <div className="filter-switchers">
      <div className="filter-switchers_top-rated">
        <span className="filter-switchers_top-rated_name">Top rated only</span>
        <label className="main-switch" htmlFor="top-rated-switch">
          <input type="checkbox" id="top-rated-switch" />
          <div className="main-slider round"></div>
        </label>
      </div>
      <div className="filter-switchers_sale">
        <span className="filter-switchers_sale_name">On sale only</span>
        <label className="main-switch" htmlFor="sale-switch">
          <input type="checkbox" id="sale-switch" />
          <div className="main-slider round"></div>
        </label>
      </div>
      <div className="filter-switchers_new">
        <span className="filter-switchers_new_name">New only</span>
        <label className="main-switch" htmlFor="new-switch">
          <input type="checkbox" id="new-switch" />
          <div className="main-slider round"></div>
        </label>
      </div>
    </div>
  );
};

export default FilterSwitchers;
