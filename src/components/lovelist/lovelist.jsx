import CatalogItem from '../catalog-item/catalog-item';

import './lovelist.sass';

const Lovelist = ({ items }) => {
  return (
    <div className="lovelist">
      {items.map((it) => (
        <CatalogItem key={it.id} item={it} />
      ))}
    </div>
  );
};

export default Lovelist;
