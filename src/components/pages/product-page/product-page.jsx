import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Tabs from '../../tabs/tabs';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';

import './product-page.sass';

const ProductPage = () => {
  const { id } = useParams();

  const products = useSelector((state) => state.products);
  const product = products.find((it) => it.id === id);

  return (
    <>
      <Tabs />
      <Breadcrumbs product={product} />
      <div className="product-page">
        <img
          className="product-page_image"
          alt="product_picture"
          src={product.photo}
        />
        <div className="product-page_title">{product.title}</div>
        <div className="product-page_description">{product.description}</div>
        <div className="product-page_price">{product.price}</div>
      </div>
    </>
  );
};

export default ProductPage;
