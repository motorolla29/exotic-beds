import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import Tabs from '../../tabs/tabs';
import CatalogFilters from '../../catalog-filters/catalog-filters';
import Catalog from '../../catalog/catalog';
import SearchEmpty from '../../search-empty/search-empty';

import './search-page.sass';

const SearchPage = () => {
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get('q').toLowerCase() || '';

  const foundProducts = useSelector((state) =>
    state.products.filter((it) => it.title.toLowerCase().includes(searchQuery))
  );

  return (
    <>
      <Tabs />
      <Breadcrumbs />
      <div className="search-page">
        <CatalogFilters />
        <div className="catalog-container">
          <h1 className="catalog-container_title">
            Search results for: '{searchQuery}'
          </h1>
          {foundProducts.length ? (
            <Catalog products={foundProducts} />
          ) : (
            <SearchEmpty />
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
