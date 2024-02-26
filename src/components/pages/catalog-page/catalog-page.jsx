import { useDispatch, useSelector } from 'react-redux';
import { changeCategory } from '../../../store/action';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import Tabs from '../../tabs/tabs';
import CatalogFilters from '../../catalog-filters/catalog-filters';
import CatalogItem from '../../catalog-item/catalog-item';
import { getUcFirstNoDashStr } from '../../../utils';

import './catalog-page.sass';

const CatalogPage = ({ category }) => {
  const dispatch = useDispatch();

  dispatch(changeCategory(category));

  const products = useSelector((state) => state.products).filter(
    (it) => it.category === category
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
          <div className="catalog">
            {products.map((it) => {
              return <CatalogItem key={it.id} item={it} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default CatalogPage;
