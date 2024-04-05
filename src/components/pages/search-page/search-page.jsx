import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import Tabs from '../../tabs/tabs';
import CatalogFilters from '../../catalog-filters/catalog-filters';
import Catalog from '../../catalog/catalog';
import SearchEmpty from '../../search-empty/search-empty';
import CatalogTopToolbar from '../../catalog-top-toolbar/catalog-top-toolbar';
import { sortProducts } from '../../../utils';

import './search-page.sass';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const categoryArray = searchParams.getAll('category');
  const minPrice = +searchParams.get('minPrice') || 0;
  const maxPrice = +searchParams.get('maxPrice') || 10000;
  const minRating = +searchParams.get('minRating') || 0;
  const seriesArray = searchParams.getAll('series');
  const topRated = searchParams.get('top-rated');
  const onSale = searchParams.get('sale');
  const isNew = searchParams.get('new');
  const limit = searchParams.get('limit');
  const sort = searchParams.get('sortBy');

  const searchQuery = searchParams.get('q').toLowerCase() || '';

  const products = useSelector((state) => state.products);

  const foundedProducts = products.filter((it) =>
    it.title.toLowerCase().includes(searchQuery)
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

  return (
    <>
      <Tabs />
      <Breadcrumbs />
      <div className="search-page">
        {sortedProducts.length ? (
          <CatalogFilters products={sortedProducts} />
        ) : null}
        <div className="catalog-container">
          <h1 className="catalog-container_title">
            Search results for: '{searchQuery}'
          </h1>
          {sortedProducts.length ? (
            <>
              <CatalogTopToolbar />
              <Catalog products={sortedProducts} />
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
