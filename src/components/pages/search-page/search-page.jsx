import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';

import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import Tabs from '../../tabs/tabs';
import CatalogFilters from '../../catalog-filters/catalog-filters';
import Catalog from '../../catalog/catalog';
import SearchEmpty from '../../search-empty/search-empty';
import CatalogTopToolbar from '../../catalog-top-toolbar/catalog-top-toolbar';
import {
  findCheapestProductObj,
  findMostExpensiveProductObj,
  sortProducts,
} from '../../../utils';
import CatalogPagination from '../../catalog-pagination/catalog-pagination';
import SearchPanel from '../../search-panel/search-panel';
import useWindowSize from '../../../hooks/use-window-size';

import './search-page.sass';

const SearchPage = () => {
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get('q').toLowerCase() || '';

  const searchArray = searchQuery.split(' ');

  const [ww, wh] = useWindowSize();

  const products = useSelector((state) => state.products);
  const highestPrice =
    findMostExpensiveProductObj(products).sale ||
    findMostExpensiveProductObj(products).price;
  const lowestPrice =
    findCheapestProductObj(products).sale ||
    findCheapestProductObj(products).price;

  const categoryArray = searchParams.getAll('category');
  const minPrice = +searchParams.get('minPrice') || lowestPrice;
  const maxPrice = +searchParams.get('maxPrice') || highestPrice;
  const minRating = +searchParams.get('minRating') || 0;
  const seriesArray = searchParams.getAll('series');
  const topRated = searchParams.get('top-rated');
  const onSale = searchParams.get('sale');
  const isNew = searchParams.get('new');
  const limit = searchParams.get('limit') || 24;
  const sort = searchParams.get('sortBy');

  const foundedProducts = products.filter((it) =>
    searchArray.every((q) => it.title.toLowerCase().includes(q))
  );

  const filteredProducts = foundedProducts.filter((product) => {
    if (
      (categoryArray.some(
        (category) => category.toLowerCase() === product.category.toLowerCase()
      ) ||
        !categoryArray.length) &&
      product.price >= minPrice &&
      product.price <= maxPrice &&
      product.rating >= minRating &&
      (seriesArray.some((series) =>
        product.title.toLowerCase().includes(`${series.toLowerCase()} series`)
      ) ||
        !seriesArray.length) &&
      (product.rating >= 4.9 || !topRated) &&
      (product.sale || !onSale) &&
      (product.isNew || !isNew)
    ) {
      return true;
    } else {
      return false;
    }
  });

  const sortedProducts = sortProducts(filteredProducts, sort);

  const limitedSortedProducts = sortedProducts.slice(
    ((+searchParams.get('page') || 1) - 1) * limit,
    (+searchParams.get('page') || 1) * limit
  );

  return (
    <>
      {ww <= 768 ? <SearchPanel /> : null}
      <Tabs />
      <Breadcrumbs />
      <div className="search-page">
        {sortedProducts.length && ww > 768 ? (
          <CatalogFilters products={foundedProducts} />
        ) : null}
        <div className="catalog-container">
          <h1 className="catalog-container_title">
            Search results for: '{searchQuery}'
          </h1>
          {sortedProducts.length ? (
            <>
              <CatalogTopToolbar
                products={foundedProducts}
                sortedProducts={sortedProducts}
                limitedSortedProducts={limitedSortedProducts}
              />
              <CatalogPagination products={sortedProducts} limit={limit} />
              <Catalog products={limitedSortedProducts} />
              <CatalogPagination products={sortedProducts} limit={limit} />
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
