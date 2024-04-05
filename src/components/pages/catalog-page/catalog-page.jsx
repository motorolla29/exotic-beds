import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import Tabs from '../../tabs/tabs';
import CatalogFilters from '../../catalog-filters/catalog-filters';
import Catalog from '../../catalog/catalog';
import { getUcFirstNoDashStr, sortProducts } from '../../../utils';
import CatalogTopToolbar from '../../catalog-top-toolbar/catalog-top-toolbar';

import './catalog-page.sass';
import CatalogPagination from '../../catalog-pagination/catalog-pagination';

const CatalogPage = ({ category }) => {
  const [searchParams] = useSearchParams();

  const minPrice = +searchParams.get('minPrice') || 0;
  const maxPrice = +searchParams.get('maxPrice') || 10000;
  const minRating = +searchParams.get('minRating') || 0;
  const seriesArray = searchParams.getAll('series');
  const topRated = searchParams.get('top-rated');
  const onSale = searchParams.get('sale');
  const isNew = searchParams.get('new');
  const limit = searchParams.get('limit');
  const sort = searchParams.get('sortBy');

  const products = useSelector((state) => state.products);

  const currentCategoryProducts = products.filter(
    (it) => it.category === category
  );

  const filteredProducts = currentCategoryProducts.filter((product) => {
    if (
      (product.sale || product.price) >= minPrice &&
      (product.sale || product.price) <= maxPrice &&
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

  // const limitedSortedProducts

  return (
    <>
      <Tabs />
      <Breadcrumbs />
      <div className="catalog-page">
        <CatalogFilters
          products={currentCategoryProducts}
          category={category}
        />
        <div className="catalog-container">
          <h1 className="catalog-container_title">
            {getUcFirstNoDashStr(category)}
          </h1>
          <CatalogTopToolbar />
          <CatalogPagination />
          <Catalog products={sortedProducts} />
          <CatalogPagination />
        </div>
      </div>
    </>
  );
};

export default CatalogPage;
