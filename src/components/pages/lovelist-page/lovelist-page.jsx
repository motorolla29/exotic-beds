import { useSelector } from 'react-redux';
import { useMemo, useRef } from 'react';

import Lovelist from '../../lovelist/lovelist';
import LovelistEmpty from '../../lovelist-empty/lovelist-empty';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';

import './lovelist-page.sass';

const LovelistPage = () => {
  const lovedProducts = useSelector((state) => state.lovelistProducts);
  const displayedLovelistItems = useRef();

  useMemo(() => {
    displayedLovelistItems.current = structuredClone(lovedProducts);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Breadcrumbs />
      <div className="lovelist-page">
        <h1 className="lovelist-page_title">
          My Lovelist
          <span>
            ({lovedProducts.length} loved{' '}
            {lovedProducts.length === 1 ? 'product' : 'products'})
          </span>
        </h1>
        {displayedLovelistItems.current.length ? (
          <Lovelist items={displayedLovelistItems.current} />
        ) : (
          <LovelistEmpty />
        )}
      </div>
    </>
  );
};

export default LovelistPage;
