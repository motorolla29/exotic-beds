import Tabs from '../../tabs/tabs';

import './catalog-page.sass';

const CatalogPage = ({ category }) => {
  return (
    <div className="catalog-page">
      <Tabs />
      <div>{category}</div>
    </div>
  );
};

export default CatalogPage;
