import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import Tabs from '../../tabs/tabs';
import CatalogFilters from '../../catalog-filters/catalog-filters';
import Catalog from '../../catalog/catalog';
import SearchEmpty from '../../search-empty/search-empty';
import CatalogTopToolbar from '../../catalog-top-toolbar/catalog-top-toolbar';
import {
  categoriesIds,
  findCheapestProductObj,
  findMostExpensiveProductObj,
  sortProducts,
  sortProductsForSearch,
} from '../../../utils';
import CatalogPagination from '../../catalog-pagination/catalog-pagination';
import SearchPanel from '../../search-panel/search-panel';
import useWindowSize from '../../../hooks/use-window-size';

import './search-page.sass';
import { useEffect, useMemo } from 'react';
import { setProducts } from '../../../store/action';
import { getProducts } from '../../../api/productAPI';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [ww] = useWindowSize();
  const {
    items,
    total,
    page,
    pageSize,
    minPrice,
    maxPrice,
    filterCounts = {},
  } = useSelector((state) => state.products);

  const params = useMemo(
    () => ({
      q: searchParams.get('q') || '',
      categoryId: searchParams
        .getAll('category')
        .map((cat) => categoriesIds[cat.toLowerCase()]),
      page: +searchParams.get('page') || 1,
      limit: +searchParams.get('limit') || pageSize,
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      minRating: searchParams.get('minRating'),
      series: searchParams.getAll('series'),
      topRated: searchParams.get('top-rated'),
      sale: searchParams.get('sale'),
      isNew: searchParams.get('new'),
      sortBy: searchParams.get('sortBy'),
    }),
    [searchParams, pageSize]
  );

  useEffect(() => {
    (async () => {
      const data = await getProducts(params);
      dispatch(setProducts(data));
      window.scrollTo(0, 0);
    })();
  }, [dispatch, params]);

  return (
    <>
      <Helmet>
        <title>{`${
          params.q.length ? `${params.q} - buy on Exotic Beds` : 'Search'
        }`}</title>
      </Helmet>
      {ww <= 768 ? <SearchPanel /> : null}
      <Tabs />
      <Breadcrumbs />
      <div className="search-page">
        {ww > 768 && total > 0 && (
          <CatalogFilters
            minPrice={minPrice}
            maxPrice={maxPrice}
            filterCounts={filterCounts}
          />
        )}
        <div className="catalog-container">
          <h1 className="catalog-container_title">
            Search results for: '{params.q}'
          </h1>
          {items.length ? (
            <>
              <CatalogTopToolbar
                total={total}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />
              <CatalogPagination total={total} page={page} limit={pageSize} />
              <Catalog products={items} />
              <CatalogPagination total={total} page={page} limit={pageSize} />
            </>
          ) : (
            <SearchEmpty />
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
