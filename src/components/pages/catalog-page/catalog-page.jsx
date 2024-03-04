import { useSelector } from 'react-redux';

import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import Tabs from '../../tabs/tabs';
import CatalogFilters from '../../catalog-filters/catalog-filters';
import Catalog from '../../catalog/catalog';
import { getUcFirstNoDashStr } from '../../../utils';

import './catalog-page.sass';
import CatalogTopToolbar from '../../catalog-top-toolbar/catalog-top-toolbar';

const CatalogPage = ({ category }) => {
  const products = useSelector((state) =>
    state.products.filter((it) => it.category === category)
  );

  return (
    <>
      <Tabs />
      <Breadcrumbs />
      <div className="catalog-page">
        <CatalogFilters />
        <div className="catalog-container">
          <h1 className="catalog-container_title">
            {getUcFirstNoDashStr(category)}
          </h1>
          <CatalogTopToolbar />
          <Catalog products={products} />
        </div>
      </div>
    </>
  );
};

export default CatalogPage;
