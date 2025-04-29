import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import Tabs from '../../tabs/tabs';
import CatalogFilters from '../../catalog-filters/catalog-filters';
import Catalog from '../../catalog/catalog';
import {
  categoriesIds,
  findCheapestProductObj,
  findMostExpensiveProductObj,
  getUcFirstNoDashStr,
  sortProducts,
} from '../../../utils';
import CatalogTopToolbar from '../../catalog-top-toolbar/catalog-top-toolbar';
import CatalogPagination from '../../catalog-pagination/catalog-pagination';
import CatalogEmpty from '../../catalog-empty/catalog-empty';
import SearchPanel from '../../search-panel/search-panel';
import useWindowSize from '../../../hooks/use-window-size';

import './catalog-page.sass';

const CatalogPage = ({ category }) => {
  const [searchParams] = useSearchParams();
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);

  const [ww] = useWindowSize();

  const highestPrice =
    findMostExpensiveProductObj(products)?.sale ||
    findMostExpensiveProductObj(products)?.price;
  const lowestPrice =
    findCheapestProductObj(products)?.sale ||
    findCheapestProductObj(products)?.price;

  const minPrice = +searchParams.get('minPrice') || lowestPrice;
  const maxPrice = +searchParams.get('maxPrice') || highestPrice;
  const minRating = +searchParams.get('minRating') || 0;
  const seriesArray = searchParams.getAll('series');
  const topRated = searchParams.get('top-rated');
  const onSale = searchParams.get('sale');
  const isNew = searchParams.get('new');
  const limit = searchParams.get('limit') || 24;
  const sort = searchParams.get('sortBy');

  const currentCategoryProducts = products.filter(
    (it) => it.categoryId === categoriesIds[category]
  );

  let filteredProducts = currentCategoryProducts.filter((product) => {
    const priceToUse = product.sale ? product.sale : product.price;
    if (
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
    }
    return false;
  });

  if (!user || user.role !== 'ADMIN') {
    filteredProducts = filteredProducts.filter(
      (product) => product.availableQuantity > 0
    );
  }

  let sortedProducts = sortProducts(filteredProducts, sort);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    products.length && (
      <>
        <Helmet>
          <title>
            {category ? `${getUcFirstNoDashStr(category)} Catalog` : 'Catalog'}
          </title>
        </Helmet>
        {ww <= 768 ? <SearchPanel /> : null}
        <Tabs />
        <Breadcrumbs />
        <div className="catalog-page">
          {ww > 768 ? (
            <CatalogFilters
              products={currentCategoryProducts}
              category={category}
            />
          ) : null}
          <div className="catalog-container">
            <h1 className="catalog-container_title">
              {getUcFirstNoDashStr(category)}
            </h1>

            {sortedProducts.length ? (
              <>
                <CatalogTopToolbar
                  products={currentCategoryProducts}
                  category={category}
                  sortedProducts={sortedProducts}
                  limitedSortedProducts={limitedSortedProducts}
                />
                {sortedProducts.length > 24 && (
                  <CatalogPagination products={sortedProducts} limit={limit} />
                )}
                <Catalog products={limitedSortedProducts} category={category} />
                {sortedProducts.length > 24 && (
                  <CatalogPagination products={sortedProducts} limit={limit} />
                )}
              </>
            ) : (
              <CatalogEmpty />
            )}
          </div>
        </div>
      </>
    )
  );
};

export default CatalogPage;
