import { useSearchParams } from 'react-router-dom';
import StickyBox from 'react-sticky-box';

import CategoryFilter from '../filter-components/category-filter/category-filter';
import PriceFilter from '../filter-components/price-filter/price-filter';
import RatingFilter from '../filter-components/rating-filter/rating-filter';
import SeriesFilter from '../filter-components/series-filter/series-filter';
import FilterSwitchers from '../filter-components/filter-switchers/filter-switchers';
import {
  findCheapestProductObj,
  findMostExpensiveProductObj,
} from '../../utils';

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

  const onTitleClickHandler = (e) => {
    e.target.nextElementSibling.classList.contains('hidden')
      ? e.target.nextElementSibling.classList.remove('hidden')
      : e.target.nextElementSibling.classList.add('hidden');
  };
  return (
    <StickyBox className="catalog-filters" offsetTop={20} offsetBottom={20}>
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
          <h5
            className="catalog-filters_filter_title"
            onClick={onTitleClickHandler}
          >
            Category
          </h5>
          <CategoryFilter products={products} />
        </div>
      )}
      <div className="catalog-filters_filter">
        <h5
          className="catalog-filters_filter_title"
          onClick={onTitleClickHandler}
        >
          Price, €
        </h5>
        <PriceFilter
          minPrice={findCheapestProductObj(products).price}
          maxPrice={findMostExpensiveProductObj(products).price}
        />
      </div>
      <div className="catalog-filters_filter">
        <h5
          className="catalog-filters_filter_title"
          onClick={onTitleClickHandler}
        >
          Rating
        </h5>
        <RatingFilter products={products} />
      </div>
      <div className="catalog-filters_filter">
        <h5
          className="catalog-filters_filter_title"
          onClick={onTitleClickHandler}
        >
          Series
        </h5>
        <SeriesFilter products={products} />
      </div>
      <FilterSwitchers />
    </StickyBox>
  );
};

export default CatalogFilters;
