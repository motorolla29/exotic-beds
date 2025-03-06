import { useEffect, useState } from 'react';
import './admin-add-product-modal.sass';
import { v4 as uuidv4 } from 'uuid';
import imagekit from '../../imagekit';
import { useSelector } from 'react-redux';
import { scrollController } from '../../utils';
import { IoCloseOutline } from 'react-icons/io5';
import { TextField, Slider } from '@mui/material';
import { HiOutlineCamera } from 'react-icons/hi';
import SyncLoader from 'react-spinners/SyncLoader';
import validateProductData from './validate-product-data';

const AdminAddProductModal = ({ isOpen, setIsOpen, onClose, category }) => {
  const overlayLoading = useSelector((state) => state.overlayLoader);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);

  const [productData, setProductData] = useState({
    title: '',
    description: '',
    price: '',
    sale: '',
    quantity: '',
    rating: 4.0,
    category: category || 'beds',
    photo: null,
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
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(productData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitClicked(true);
    const { isValid, errors } = validateProductData(productData);
    setError(errors);
    if (isValid) {
      // Отправляем данные
      console.log('Форма отправляется');
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
    console.log('upload');
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

      console.log(authData);
      imagekit
        .upload({
          file,
          fileName: uuidv4(),
          folder: '/exotic-beds/catalog',
          ...authData,
        })
        .then((response) => {
          console.log('Image uploaded successfully');
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
      <div className="admin-add-product-modal_shadow">
        <div className="admin-add-product-modal_content">
          <div className="admin-add-product-modal_content_title">
            <h2>Add New Product</h2>
            <IoCloseOutline onClick={() => setIsOpen(false)} />
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
          <TextField
            className="admin-add-product-modal_content_name"
            label="Product Name"
            name="title"
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
            error={submitClicked && !!error.price}
            helperText={submitClicked && error.price ? error.price : ''}
            type="number"
            min="0"
            value={productData.price}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            className="admin-add-product-modal_content_sale"
            label="Sale Price (optional)"
            name="sale"
            error={submitClicked && !!error.sale}
            helperText={submitClicked && error.sale ? error.sale : ''}
            type="number"
            min="0"
            value={productData.sale}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            className="admin-add-product-modal_content_quantity"
            label="Quantity Available"
            name="quantity"
            error={submitClicked && !!error.quantity}
            helperText={submitClicked && error.quantity ? error.quantity : ''}
            type="number"
            min="0"
            value={productData.quantity}
            onChange={handleChange}
            fullWidth
          />
          <div className="admin-add-product-modal_content_rating">
            <TextField
              className="admin-add-product-modal_content_rating_input"
              label="Rating"
              name="rating"
              error={submitClicked && !!error.rating}
              helperText={submitClicked && error.rating ? error.rating : ''}
              type="number"
              min="0"
              value={productData.rating}
              onChange={handleChange}
              inputProps={{
                min: 0,
                max: 5,
                step: 0.01,
              }}
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
                step={0.01}
                valueLabelDisplay="auto"
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="admin-add-product-modal_content_add-button"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProductModal;
