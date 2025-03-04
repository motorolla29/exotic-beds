import CatalogItem from '../catalog-item/catalog-item';
import { BsPlusLg } from 'react-icons/bs';

import './catalog.sass';
import { useState } from 'react';
import AdminAddProductModal from '../admin-add-product-modal/admin-add-product-modal';

const Catalog = ({ products, category }) => {
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  return (
    <div className="catalog">
      {1 && (
        <div
          onClick={() => setAdminModalOpen(true)}
          className="catalog_admin-add-product"
        >
          <BsPlusLg />
        </div>
      )}
      {products?.map((it) => {
        return <CatalogItem key={it.id} item={{ ...it, productId: it.id }} />;
      })}
      {adminModalOpen && (
        <AdminAddProductModal
          setIsOpen={setAdminModalOpen}
          isOpen={adminModalOpen}
          onClose={() => setAdminModalOpen(false)}
          category={category}
        />
      )}
    </div>
  );
};

export default Catalog;
