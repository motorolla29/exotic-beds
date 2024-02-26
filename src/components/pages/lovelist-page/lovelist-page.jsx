import { useSelector } from 'react-redux';

import Lovelist from '../../lovelist/lovelist';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';

import './lovelist-page.sass';
import LovelistEmpty from '../../lovelist-empty/lovelist-empty';

const LovelistPage = () => {
  const lovedProducts = useSelector((state) => state.lovelistProducts);

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
        {lovedProducts ? <Lovelist items={lovedProducts} /> : <LovelistEmpty />}
      </div>
    </>
  );
};

export default LovelistPage;
