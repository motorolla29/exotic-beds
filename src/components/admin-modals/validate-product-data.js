const validateProductData = (formData) => {
  let isValid = true;
  const errors = {
    title: '',
    description: '',
    price: '',
    sale: '',
    quantity: '',
    rating: '',
    photo: '',
  };

  // Проверка title
  if (!formData.title.trim()) {
    errors.title = 'Title is required';
    isValid = false;
  }

  // Проверка description
  if (!formData.description.trim()) {
    errors.description = 'Description is required';
    isValid = false;
  }

  // Проверка price (должно быть числом и неотрицательным)
  if (formData.price === '' || isNaN(Number(formData.price))) {
    errors.price = 'Price must be a valid number';
    isValid = false;
  } else if (Number(formData.price) < 0) {
    errors.price = 'Price cannot be negative';
    isValid = false;
  }

  // Проверка sale (если заполнено, должно быть числом и неотрицательным)
  if (formData.sale !== '') {
    if (isNaN(Number(formData.sale))) {
      errors.sale = 'Sale must be a valid number';
      isValid = false;
    } else if (Number(formData.sale) < 0) {
      errors.sale = 'Sale cannot be negative';
      isValid = false;
    }
  }

  // Проверка quantity (должно быть числом и неотрицательным)
  if (formData.quantity === '' || isNaN(Number(formData.quantity))) {
    errors.quantity = 'Quantity must be a valid number';
    isValid = false;
  } else if (Number(formData.quantity) < 0) {
    errors.quantity = 'Quantity cannot be negative';
    isValid = false;
  }

  // Проверка rating (число от 0 до 5)
  if (formData.rating === '' || isNaN(Number(formData.rating))) {
    errors.rating = 'Rating must be a valid number';
    isValid = false;
  } else if (Number(formData.rating) < 0 || Number(formData.rating) > 5) {
    errors.rating = 'Rating must be between 0 and 5';
    isValid = false;
  }

  // Проверка photo (если поле обязательно)
  if (!formData.photo) {
    errors.photo = 'Photo is required';
    isValid = false;
  }

  return { isValid, errors };
};

export default validateProductData;
