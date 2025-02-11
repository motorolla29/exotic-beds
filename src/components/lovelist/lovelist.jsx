import CatalogItem from '../catalog-item/catalog-item';

import './lovelist.sass';

const Lovelist = ({ items }) => {
  return (
    <div className="lovelist">
      {items?.map((it) => (
        <CatalogItem key={it.productId} item={it} size="medium" />
      ))}
    </div>
  );
};

export default Lovelist;
