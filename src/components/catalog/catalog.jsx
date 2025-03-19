import CatalogItem from '../catalog-item/catalog-item';
import { BsPlusLg } from 'react-icons/bs';

import './catalog.sass';
import { useState } from 'react';
import AdminAddProductModal from '../admin-modals/admin-add-product-modal';
import { AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Catalog = ({ products, category }) => {
  const isAuth = useSelector((state) => state.isAuth);
  const user = useSelector((state) => state.user);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const page = +searchParams.get('page');

  return (
    <div className="catalog">
      {isAuth && user.role === 'ADMIN' && page <= 1 && (
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
      <AnimatePresence>
        {adminModalOpen && (
          <AdminAddProductModal
            isOpen={adminModalOpen}
            onClose={() => setAdminModalOpen(false)}
            category={category}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Catalog;
