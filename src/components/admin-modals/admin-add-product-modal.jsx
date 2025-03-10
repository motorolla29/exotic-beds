import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import imagekit from '../../imagekit';
import { motion } from 'framer-motion';

import { TextField, Slider } from '@mui/material';
import JoyFormControl from '@mui/joy/FormControl';
import JoyFormLabel from '@mui/joy/FormLabel';
import JoySelect from '@mui/joy/Select';
import JoyOption from '@mui/joy/Option';

import { IoCloseOutline } from 'react-icons/io5';
import { HiOutlineCamera } from 'react-icons/hi';
import SyncLoader from 'react-spinners/SyncLoader';
import ClipLoader from 'react-spinners/ClipLoader';
import DoneIcon from '@mui/icons-material/Done';

import validateProductData from './validate-product-data';
import useWindowSize from '../../hooks/use-window-size';
import { categoriesIds, scrollController } from '../../utils';
import {
  setProducts,
  setProductsLoaded,
  setSnackbar,
} from '../../store/action';
import { createProduct, getAllProducts } from '../../api/productAPI';

import './admin-modals.sass';

const AdminAddProductModal = ({ isOpen, onClose, category }) => {
  const overlayLoading = useSelector((state) => state.overlayLoader);
  const dispatch = useDispatch();
  const [ww] = useWindowSize();
  const [photoLoading, setPhotoLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);

  const [productData, setProductData] = useState({
    category: category || 'beds',
    photo: null,
    title: '',
    description: '',
    price: '',
    sale: '',
    quantity: '',
    rating: 4.0,
  });

  const [error, setError] = useState({
    title: '',
    description: '',
    price: '',
    sale: '',
    quantity: '',
    rating: '',
    photo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError({ ...error, [name]: '' });
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitClicked(true);
    const { isValid, errors } = validateProductData(productData);
    setError(errors);
    if (isValid) {
      setSubmitting(true);
      const adaptedData = {
        categoryId: categoriesIds[productData.category],
        photo: productData.photo,
        title: productData.title,
        description: productData.description,
        price: +productData.price,
        sale: productData.sale ? +productData.sale : null,
        availableQuantity: +productData.quantity,
        rating: +(+productData.rating).toFixed(1),
      };
      createProduct(adaptedData)
        .then(async () => {
          dispatch(setProductsLoaded(false));
          const productData = await getAllProducts();
          dispatch(setProducts(productData.rows));
          dispatch(setProductsLoaded(true));
          onClose();
          dispatch(
            setSnackbar({
              open: true,
              text: 'Product successfully added',
              decorator: <DoneIcon />,
            })
          );
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setSubmitting(false);
        });
      console.log('Форма отправляется', adaptedData);
    } else {
      console.log('Ошибки валидации');
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (!overlayLoading) scrollController.disabledScroll();
    } else {
      if (!overlayLoading) scrollController.enabledScroll();
    }
    return () => scrollController.enabledScroll();
  }, [isOpen, overlayLoading]);

  if (!isOpen) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      console.warn('No file selected');
      return;
    }

    e.target.value = null;

    if (file) {
      setPhotoLoading(true);
      const authRes = await fetch(
        `${process.env.REACT_APP_API_URL}/api/imagekit-auth`
      );
      const authData = await authRes.json();

      imagekit
        .upload({
          file,
          fileName: uuidv4(),
          folder: '/exotic-beds/catalog',
          ...authData,
        })
        .then((response) => {
          setProductData((prev) => ({
            ...prev,
            photo: response.name,
          }));
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setPhotoLoading(false);
        });
    }
  };

  return (
    <div className="admin-add-product-modal">
      <motion.div
        key="admin-add-product-modal-shadow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="admin-add-product-modal_shadow"
      >
        <motion.div
          key="admin-add-product-modal-content"
          initial={{ scale: 0.1 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.1 }}
          className="admin-add-product-modal_content"
        >
          <div className="admin-add-product-modal_content_title">
            <h2>Add New Product</h2>
            <IoCloseOutline onClick={onClose} />
          </div>
          <div className="admin-add-product-modal_content_photo-container">
            <div className="admin-add-product-modal_content_photo">
              {productData.photo && (
                <img
                  alt="product_photo"
                  src={`https://ik.imagekit.io/motorolla29/exotic-beds/catalog/${productData.photo}?tr=w-150`}
                />
              )}
              <label htmlFor="avatar_load">
                <input
                  id="avatar_load"
                  type="file"
                  className="profile-page_heading_photo"
                  onChange={handleImageUpload}
                  disabled={photoLoading}
                />
              </label>
              <div className="admin-add-product-modal_content_photo_background">
                {photoLoading ? (
                  <SyncLoader speedMultiplier={0.9} />
                ) : (
                  <HiOutlineCamera className="camera" />
                )}
              </div>
            </div>
            {error.photo ? <span className="error">{error.photo}</span> : ''}
          </div>
          <JoyFormControl className="admin-add-product-modal_content_category-select">
            <JoyFormLabel
              id="category-select-label"
              htmlFor="category-select-id"
            >
              Category
            </JoyFormLabel>
            <JoySelect
              id="category-select-id"
              name="category"
              value={productData.category}
              onChange={(event, newValue) =>
                handleChange({
                  target: { name: 'category', value: newValue },
                })
              }
              slotProps={{
                listbox: {
                  disablePortal: true,
                },
                button: {
                  id: 'category-select-id',
                  'aria-labelledby': 'category-select-label category-select-id',
                },
              }}
              renderValue={(selected) => {
                const selectedCategory = Object.keys(categoriesIds).find(
                  (category) => category === selected.value
                );
                return selectedCategory ? selectedCategory : 'Select category';
              }}
            >
              {Object.keys(categoriesIds).map((category) => (
                <JoyOption key={category} value={category}>
                  {category}
                </JoyOption>
              ))}
            </JoySelect>
          </JoyFormControl>
          <TextField
            className="admin-add-product-modal_content_name"
            label="Product Name"
            name="title"
            size={ww > 480 ? 'normal' : 'small'}
            error={submitClicked && !!error.title}
            helperText={submitClicked && error.title ? error.title : ''}
            value={productData.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            className="admin-add-product-modal_content_description"
            label="Description"
            placeholder="Write something about this product..."
            name="description"
            size={ww > 480 ? 'normal' : 'small'}
            error={submitClicked && !!error.description}
            helperText={
              submitClicked && error.description ? error.description : ''
            }
            value={productData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            className="admin-add-product-modal_content_price"
            label="Price (€)"
            name="price"
            size={ww > 480 ? 'normal' : 'small'}
            error={submitClicked && !!error.price}
            helperText={submitClicked && error.price ? error.price : ''}
            type="text"
            value={productData.price}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            className="admin-add-product-modal_content_sale"
            label="Sale Price (optional)"
            name="sale"
            size={ww > 480 ? 'normal' : 'small'}
            error={submitClicked && !!error.sale}
            helperText={submitClicked && error.sale ? error.sale : ''}
            type="text"
            value={productData.sale}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            className="admin-add-product-modal_content_quantity"
            label="Quantity Available"
            name="quantity"
            size={ww > 480 ? 'normal' : 'small'}
            error={submitClicked && !!error.quantity}
            helperText={submitClicked && error.quantity ? error.quantity : ''}
            type="text"
            value={productData.quantity}
            onChange={handleChange}
            fullWidth
          />
          <div className="admin-add-product-modal_content_rating">
            <TextField
              className="admin-add-product-modal_content_rating_input"
              label="Rating"
              name="rating"
              size={ww > 480 ? 'normal' : 'small'}
              error={submitClicked && !!error.rating}
              helperText={submitClicked && error.rating ? error.rating : ''}
              type="text"
              value={productData.rating}
              onChange={handleChange}
              fullWidth
            />
            <div className="admin-add-product-modal_content_rating_slider-container">
              <Slider
                className="admin-add-product-modal_content_rating_slider"
                value={productData.rating}
                name="rating"
                onChange={handleChange}
                min={0}
                max={5}
                step={0.1}
                valueLabelDisplay="auto"
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="admin-add-product-modal_content_submit-button"
            disabled={
              submitting ||
              !productData.title ||
              !productData.description ||
              !productData.price ||
              !productData.quantity
            }
          >
            {submitting ? <ClipLoader color="#e9d5be" /> : 'Add Product'}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminAddProductModal;
