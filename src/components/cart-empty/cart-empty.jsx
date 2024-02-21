import { useDispatch } from 'react-redux';

import { cartOpen } from '../../store/action';

import './cart-empty.sass';

const CartEmpty = () => {
  const dispatch = useDispatch();

  return (
    <div className="cart-empty">
      <div className="cart-empty_description">
        Don't waste time and take a look at our product catalog
      </div>
      <div
        onClick={() => dispatch(cartOpen(false))}
        className="cart-empty_start-shopping"
      >
        Start shopping
      </div>
    </div>
  );
};

export default CartEmpty;
