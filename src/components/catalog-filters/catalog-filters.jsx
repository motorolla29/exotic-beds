import { useSearchParams } from 'react-router-dom';

import CategoryFilter from '../filter-components/category-filter/category-filter';
import PriceFilter from '../filter-components/price-filter/price-filter';
import RatingFilter from '../filter-components/rating-filter/rating-filter';
import SeriesFilter from '../filter-components/series-filter/series-filter';
import FilterSwitchers from '../filter-components/filter-switchers/filter-switchers';

import './catalog-filters.sass';

const CatalogFilters = ({ products, category }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const isFilterParams =
    searchParams.has('category') ||
    searchParams.has('series') ||
    searchParams.has('minRating') ||
    searchParams.has('minPrice') ||
    searchParams.has('maxPrice') ||
    searchParams.has('top-rated') ||
    searchParams.has('sale') ||
    searchParams.has('new');

  const onClearButtonHandler = () => {
    searchParams.delete('category');
    searchParams.delete('series');
    searchParams.delete('minRating');
    searchParams.delete('minPrice');
    searchParams.delete('maxPrice');
    searchParams.delete('top-rated');
    searchParams.delete('sale');
    searchParams.delete('new');
    setSearchParams(searchParams);
  };

  const cheapestProductObj = products.reduce((x, y) => {
    if (x.sale && y.sale && x.sale < y.sale) {
      return x;
    }
    if (x.sale && !y.sale && x.sale < y.price) {
      return x;
    }
    if (!x.sale && y.sale && x.price < y.sale) {
      return x;
    }
    if (!x.sale && !y.sale && x.price < y.price) {
      return x;
    }
    return y;
  });

  const mostExpensiveProductObj = products.reduce((x, y) => {
    if (x.sale && y.sale && x.sale > y.sale) {
      return x;
    }
    if (x.sale && !y.sale && x.sale > y.price) {
      return x;
    }
    if (!x.sale && y.sale && x.price > y.sale) {
      return x;
    }
    if (!x.sale && !y.sale && x.price > y.price) {
      return x;
    }
    return y;
  });

  console.log(cheapestProductObj);
  console.log(mostExpensiveProductObj);

  return (
    <div className="catalog-filters-container">
      <div className="catalog-filters">
        <div className="catalog-filters_header">
          <h3 className="catalog-filters_header_main-title">Filter By</h3>
          {isFilterParams ? (
            <button
              onClick={onClearButtonHandler}
              className="catalog-filters_header_clear-button"
            >
              {' '}
              Clear all
            </button>
          ) : null}
        </div>
        {category ? null : (
          <div className="catalog-filters_filter">
            <h5 className="catalog-filters_filter_title">Category</h5>
            <CategoryFilter />
          </div>
        )}
        <div className="catalog-filters_filter">
          <h5 className="catalog-filters_filter_title">Price, €</h5>
          <PriceFilter
            minPrice={cheapestProductObj.price}
            maxPrice={mostExpensiveProductObj.price}
          />
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
    </div>
  );
};

export default CatalogFilters;
