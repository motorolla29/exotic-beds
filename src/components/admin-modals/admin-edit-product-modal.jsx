import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import imagekit from '../../imagekit';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

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
import ErrorIcon from '@mui/icons-material/Error';

import validateProductData from './validate-product-data';
import { categoriesIds, scrollController } from '../../utils';
import useWindowSize from '../../hooks/use-window-size';
import { getProducts, updateProduct } from '../../api/productAPI';
import {
  setNotificationModal,
  setProducts,
  setSnackbar,
} from '../../store/action';
import {
  getImagekitAuth,
  deleteImageFromImagekit,
} from '../../api/imagekitAPI';

import './admin-modals.sass';

const AdminEditProductModal = ({ isOpen, onClose, item }) => {
  const [searchParams] = useSearchParams();
  const overlayLoading = useSelector((state) => state.overlayLoader);
  const { pageSize } = useSelector((s) => s.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [ww] = useWindowSize();
  const [photoLoading, setPhotoLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);

  const [productData, setProductData] = useState({
    category: Object.keys(categoriesIds).find(
      (key) => categoriesIds[key] === item.categoryId
    ),
    photo: item.photo,
    title: item.title,
    description: item.description,
    price: item.price,
    sale: item.sale || '',
    quantity: item.availableQuantity,
    rating: item.rating,
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

  const params = useMemo(
    () => ({
      categoryId: productData.category && categoriesIds[productData.category],
      page: +searchParams.get('page') || 1,
      limit: +searchParams.get('limit') || pageSize,
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      minRating: searchParams.get('minRating'),
      series: searchParams.getAll('series'),
      topRated: searchParams.get('top-rated'),
      sale: searchParams.get('sale'),
      isNew: searchParams.get('new'),
      sortBy: searchParams.get('sortBy'),
    }),
    [productData.category, searchParams, pageSize]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError({ ...error, [name]: '' });
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitClicked(true);
    const { isValid, errors } = validateProductData(productData);
    setError(errors);
    if (isValid) {
      try {
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

        const previousPhoto = item.photo;

        const updatedProduct = await updateProduct(item.id, adaptedData);

        if (
          updatedProduct.id !== item.id &&
          location.pathname === `/${item.id}`
        ) {
          navigate(`/${updatedProduct.id}`, { replace: true });
        }

        const updatedProducts = await getProducts(params);
        dispatch(setProducts(updatedProducts));

        onClose();
        dispatch(
          setSnackbar({
            open: true,
            text: 'Product successfully updated',
            decorator: <DoneIcon />,
          })
        );
        if (previousPhoto && previousPhoto !== adaptedData.photo) {
          try {
            await deleteImageFromImagekit(previousPhoto);
          } catch (error) {
            console.error('Error deleting old image:', error);
          }
        }
      } catch (error) {
        dispatch(
          setNotificationModal({
            open: true,
            icon: <ErrorIcon />,
            title: 'Failed to update product',
            description: error.response?.data?.message || error.message,
          })
        );
        console.error('Error updating product:', error);
      } finally {
        setSubmitting(false);
      }
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

    try {
      setPhotoLoading(true);

      const authData = await getImagekitAuth();

      const response = await imagekit.upload({
        file,
        fileName: uuidv4(),
        folder: '/exotic-beds/catalog',
        ...authData,
      });

      if (
        productData.photo &&
        productData.photo !== response.name &&
        productData.photo !== item.photo
      ) {
        try {
          await deleteImageFromImagekit(productData.photo);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      setProductData((prev) => ({
        ...prev,
        photo: response.name,
      }));
    } catch (error) {
      dispatch(
        setNotificationModal({
          open: true,
          icon: <ErrorIcon />,
          title: 'Failed to upload image',
          description: error.response?.data?.message || error.message,
        })
      );
      console.error('Error uploading image:', error);
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleCloseModal = async () => {
    onClose();
    if (productData.photo && productData.photo !== item.photo) {
      try {
        deleteImageFromImagekit(productData.photo).catch((deleteError) => {
          console.error('Error deleting uploaded photo:', deleteError);
        });
      } catch (deleteError) {
        console.error('Error deleting uploaded photo:', deleteError);
      }
    }
  };

  return (
    <div className="admin-edit-product-modal">
      <motion.div
        key="admin-add-product-modal-shadow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="admin-edit-product-modal_shadow"
      >
        <OverlayScrollbarsComponent defer>
          <div className="admin-add-product-modal_content-container">
            <motion.div
              key="admin-add-product-modal-content"
              initial={{ scale: 0.1 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.1 }}
              className="admin-edit-product-modal_content"
            >
              <div className="admin-edit-product-modal_content_title">
                <h2>Edit Product</h2>
                <IoCloseOutline onClick={handleCloseModal} />
              </div>
              <div className="admin-edit-product-modal_content_photo-container">
                <div className="admin-edit-product-modal_content_photo">
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
                  <div className="admin-edit-product-modal_content_photo_background">
                    {photoLoading ? (
                      <SyncLoader speedMultiplier={0.9} />
                    ) : (
                      <HiOutlineCamera className="camera" />
                    )}
                  </div>
                </div>
                {error.photo ? (
                  <span className="error">{error.photo}</span>
                ) : (
                  ''
                )}
              </div>
              <JoyFormControl className="admin-edit-product-modal_content_category-select">
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
                      'aria-labelledby':
                        'category-select-label category-select-id',
                    },
                  }}
                  renderValue={(selected) => {
                    const selectedCategory = Object.keys(categoriesIds).find(
                      (category) => category === selected.value
                    );
                    return selectedCategory
                      ? selectedCategory
                      : 'Select category';
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
                className="admin-edit-product-modal_content_name"
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
                className="admin-edit-product-modal_content_description"
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
                className="admin-edit-product-modal_content_price"
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
                className="admin-edit-product-modal_content_sale"
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
                className="admin-edit-product-modal_content_quantity"
                label="Quantity Available"
                name="quantity"
                size={ww > 480 ? 'normal' : 'small'}
                error={submitClicked && !!error.quantity}
                helperText={
                  submitClicked && error.quantity ? error.quantity : ''
                }
                type="text"
                value={productData.quantity}
                onChange={handleChange}
                fullWidth
              />
              <div className="admin-edit-product-modal_content_rating">
                <TextField
                  className="admin-edit-product-modal_content_rating_input"
                  label="Rating"
                  name="rating"
                  size={ww > 480 ? 'normal' : 'small'}
                  error={submitClicked && !!error.rating}
                  helperText={submitClicked && error.rating ? error.rating : ''}
                  type="text"
                  value={productData.rating.toString().replace(',', '.')}
                  onChange={handleChange}
                  fullWidth
                />
                <div className="admin-edit-product-modal_content_rating_slider-container">
                  <Slider
                    className="admin-edit-product-modal_content_rating_slider"
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
                className="admin-edit-product-modal_content_submit-button"
                disabled={
                  submitting ||
                  (item.photo === productData.photo &&
                    item.categoryId === categoriesIds[productData.category] &&
                    item.title === productData.title &&
                    item.description === productData.description &&
                    item.price === Number(productData.price) &&
                    (item.sale === Number(productData.sale) ||
                      (item.sale === null && !!productData.sale === false)) &&
                    item.availableQuantity === Number(productData.quantity) &&
                    item.rating === Number(productData.rating))
                }
              >
                {submitting ? <ClipLoader color="#e9d5be" /> : 'Save Changes'}
              </button>
            </motion.div>
          </div>
        </OverlayScrollbarsComponent>
      </motion.div>
    </div>
  );
};

export default AdminEditProductModal;
