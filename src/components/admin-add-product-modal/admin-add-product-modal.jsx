import { useEffect, useState } from 'react';
import './admin-add-product-modal.sass';
import { useSelector } from 'react-redux';
import { scrollController } from '../../utils';
import { IoCloseOutline } from 'react-icons/io5';
import { TextField, Slider, Button } from '@mui/material';

const AdminAddProductModal = ({ isOpen, setIsOpen, onClose, category }) => {
  const overlayLoading = useSelector((state) => state.overlayLoader);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    sale: '',
    quantity: '',
    rating: 4.0,
    category: category || 'beds',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {};

  const handleRatingChange = (event, newValue) => {
    setFormData((prev) => ({ ...prev, rating: newValue }));
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

  return (
    <div className="admin-add-product-modal">
      <div className="admin-add-product-modal_shadow">
        <div className="admin-add-product-modal_content">
          <div className="admin-add-product-modal_content_title">
            <h2>Add New Product</h2>
            <IoCloseOutline onClick={() => setIsOpen(false)} />
          </div>
          <TextField
            className="admin-add-product-modal_content_name"
            label="Product Name"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            className="admin-add-product-modal_content_description"
            label="Description"
            placeholder="Write something about this product..."
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            className="admin-add-product-modal_content_price"
            label="Price (€)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            className="admin-add-product-modal_content_sale"
            label="Sale Price (optional)"
            name="sale"
            type="number"
            value={formData.sale}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            className="admin-add-product-modal_content_quantity"
            label="Quantity Available"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            fullWidth
          />
          <div className="admin-add-product-modal_content_rating">
            <TextField
              className="admin-add-product-modal_content_rating_input"
              label="Rating"
              name="rating"
              type="number"
              value={formData.rating}
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
                value={formData.rating}
                onChange={handleRatingChange}
                min={0}
                max={5}
                step={0.01}
                valueLabelDisplay="auto"
              />
            </div>
          </div>
          <button className="admin-add-product-modal_content_add-button">
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProductModal;
