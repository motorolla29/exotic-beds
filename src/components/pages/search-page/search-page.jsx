import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

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

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);

  const searchQuery = (searchParams.get('q') || '').trim().toLowerCase();

  const searchArray = searchQuery.split(/\s+/).filter(Boolean);

  const [ww] = useWindowSize();

  const highestPrice =
    findMostExpensiveProductObj(products)?.sale ||
    findMostExpensiveProductObj(products)?.price;
  const lowestPrice =
    findCheapestProductObj(products)?.sale ||
    findCheapestProductObj(products)?.price;

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

  const foundedProducts = products.filter((product) => {
    // Если запрос пустой, возвращаем все товары
    if (!searchArray.length) return true;

    const title = product.title ? product.title.trim().toLowerCase() : '';

    // Требуем, чтобы каждый непустой поисковой запрос встречался в названии
    return searchArray.every((q) => title.includes(q));
  });

  let filteredProducts = foundedProducts.filter((product) => {
    const priceToUse = product.sale ? product.sale : product.price;
    if (
      (categoryArray.some(
        (category) =>
          categoriesIds[category.toLowerCase()] === product.categoryId
      ) ||
        !categoryArray.length) &&
      priceToUse >= minPrice &&
      priceToUse <= maxPrice &&
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

  if (!user || user.role !== 'ADMIN') {
    filteredProducts = filteredProducts.filter(
      (product) => product.availableQuantity > 0
    );
  }

  let sortedProducts =
    sort === 'relevance' || !sort
      ? sortProductsForSearch(filteredProducts, searchArray)
      : sortProducts(filteredProducts, sort);

  if (user && user.role === 'ADMIN') {
    const availableProducts = sortedProducts.filter(
      (product) => product.availableQuantity > 0
    );
    const outOfStockProducts = sortedProducts.filter(
      (product) => product.availableQuantity === 0
    );
    sortedProducts = [...availableProducts, ...outOfStockProducts];
  }

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
