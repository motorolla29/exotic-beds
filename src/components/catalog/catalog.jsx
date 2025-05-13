import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import CatalogItem from '../catalog-item/catalog-item';
import AdminAddProductModal from '../admin-modals/admin-add-product-modal';
import { BsPlusLg } from 'react-icons/bs';

import './catalog.sass';

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
        return (
          <CatalogItem
            key={it.id}
            item={{ ...it, productId: it.id }}
            category={category}
          />
        );
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
