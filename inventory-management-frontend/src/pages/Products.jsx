import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddProduct.css';

function AddProduct() {
  const [name, setName] = useState('');
  const [stock, setStock] = useState(0);
  const [whereToBuy, setWhereToBuy] = useState('');  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const newProduct = { name, stock, whereToBuy }; 
      const response = await axios.post('http://13.247.60.72:5000/api/products', newProduct);  // Send 'whereToBuy' to the API
      setSuccess(`Product added successfully: ${response.data.name}`);
      setName('');
      setStock(0);
      setWhereToBuy('');  // Reset the field after successful submission
    } catch (error) {
      setError('Error adding product. Please try again.');
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="add-product-page">
      <h1>Add New Product</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value ? Number(e.target.value) : '')}
          required
        />
        <input
          type="text"
          placeholder="Where to Buy"  // New input for 'Where to Buy'
          value={whereToBuy}
          onChange={(e) => setWhereToBuy(e.target.value)}  // Update state on input change
          required
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
