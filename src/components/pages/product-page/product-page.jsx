import { useParams } from 'react-router-dom';
import Tabs from '../../tabs/tabs';

import './product-page.sass';

const ProductPage = () => {
  const { id } = useParams();

  return (
    <>
      <Tabs />
      <div>Page of {id} product</div>
    </>
  );
};

export default ProductPage;
