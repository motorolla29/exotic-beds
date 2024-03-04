import CatalogItem from '../catalog-item/catalog-item';

import './catalog.sass';

const Catalog = ({ products }) => {
  return (
    <div className="catalog">
      {products.map((it) => {
        return <CatalogItem key={it.id} item={it} />;
      })}
    </div>
  );
};

export default Catalog;
