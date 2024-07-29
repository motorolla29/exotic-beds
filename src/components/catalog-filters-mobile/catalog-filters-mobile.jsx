import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { motion } from 'framer-motion';

import CategoryFilter from '../filter-components/category-filter/category-filter';
import PriceFilter from '../filter-components/price-filter/price-filter';
import RatingFilter from '../filter-components/rating-filter/rating-filter';
import SeriesFilter from '../filter-components/series-filter/series-filter';
import FilterSwitchers from '../filter-components/filter-switchers/filter-switchers';
import {
  findCheapestProductObj,
  findMostExpensiveProductObj,
  scrollController,
} from '../../utils';

import './catalog-filters-mobile.sass';

const CatalogFiltersMobile = ({
  closeFilters,
  products,
  category,
  sortedProducts,
}) => {
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
    e.target.classList.contains('hidden')
      ? e.target.classList.remove('hidden')
      : e.target.classList.add('hidden');
    e.target.nextElementSibling.classList.contains('hidden')
      ? e.target.nextElementSibling.classList.remove('hidden')
      : e.target.nextElementSibling.classList.add('hidden');
  };

  useEffect(() => {
    scrollController.disabledScroll();
    return () => scrollController.enabledScroll();
  });

  return (
    <motion.div exit={{ opacity: 0 }}>
      <OverlayScrollbarsComponent className="catalog-filters-mobile">
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            damping: 8,
            stiffness: 80,
          }}
          exit={{ y: -150, opacity: 0, transition: 0 }}
        >
          <div className="catalog-filters-mobile_header">
            <h3 className="catalog-filters-mobile_header_main-title">
              Filter By
            </h3>
            {isFilterParams ? (
              <button
                onClick={onClearButtonHandler}
                className="catalog-filters-mobile_header_clear-button"
              >
                {' '}
                Clear all
              </button>
            ) : null}
          </div>
          {category ? null : (
            <div className="catalog-filters-mobile_filter">
              <h5
                className="catalog-filters-mobile_filter_title"
                onClick={onTitleClickHandler}
              >
                Category
              </h5>
              <CategoryFilter products={products} />
            </div>
          )}
          <div className="catalog-filters-mobile_filter">
            <h5
              className="catalog-filters-mobile_filter_title"
              onClick={onTitleClickHandler}
            >
              Price, €
            </h5>
            <PriceFilter
              minPrice={findCheapestProductObj(products).price}
              maxPrice={findMostExpensiveProductObj(products).price}
            />
          </div>
          <div className="catalog-filters-mobile_filter">
            <h5
              className="catalog-filters-mobile_filter_title"
              onClick={onTitleClickHandler}
            >
              Rating
            </h5>
            <RatingFilter products={products} />
          </div>
          <div className="catalog-filters-mobile_filter">
            <h5
              className="catalog-filters-mobile_filter_title"
              onClick={onTitleClickHandler}
            >
              Series
            </h5>
            <SeriesFilter products={products} />
          </div>
          <FilterSwitchers />
          <div className="catalog-filters-mobile_show-products-button">
            <button onClick={closeFilters}>
              Show {sortedProducts.length}{' '}
              {sortedProducts.length === 1 ? 'product' : 'products'}
            </button>
          </div>{' '}
        </motion.div>
      </OverlayScrollbarsComponent>
    </motion.div>
  );
};

export default CatalogFiltersMobile;
