import CategoryFilter from '../filter-components/category-filter/category-filter';
import PriceFilter from '../filter-components/price-filter/price-filter';
import RatingFilter from '../filter-components/rating-filter/rating-filter';
import SeriesFilter from '../filter-components/series-filter/series-filter';
import FilterSwitchers from '../filter-components/filter-switchers/filter-switchers';

import './catalog-filters.sass';

const CatalogFilters = ({ filteredProducts, category }) => {
  return (
    <div className="catalog-filters">
      <h3 className="catalog-filters_main-title">Filter By</h3>
      {category ? null : (
        <div className="catalog-filters_filter">
          <h5 className="catalog-filters_filter_title">Category</h5>
          <CategoryFilter />
        </div>
      )}
      <div className="catalog-filters_filter">
        <h5 className="catalog-filters_filter_title">Price, €</h5>
        <PriceFilter />
      </div>
      <div className="catalog-filters_filter">
        <h5 className="catalog-filters_filter_title">Rating</h5>
        <RatingFilter />
      </div>
      <div className="catalog-filters_filter">
        <h5 className="catalog-filters_filter_title">Series</h5>
        <SeriesFilter />
      </div>
      <FilterSwitchers />
    </div>
  );
};

export default CatalogFilters;
