import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import Axios
import '../styles/Products.css';

function Products() {
  const [products, setProducts] = useState([]); // State to store products
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [stockFilter, setStockFilter] = useState('all'); // State for stock filter
  const [error, setError] = useState(''); // State for error handling

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products'); // Call to the backend API
        setProducts(response.data); // Update state with fetched products
      } catch (error) {
        console.error('Error fetching products:', error); // Error handling
        setError('Error fetching products');
      }
    };

    fetchProducts(); // Call the fetch function
  }, []); // Empty dependency array to run only once

  // Function to handle stock increment and decrement
  const updateStock = async (id, newStock) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, { stock: newStock }); // Call to update stock in the backend
      setProducts(products.map(product => product._id === id ? { ...product, stock: newStock } : product)); // Update local state
    } catch (error) {
      console.error('Error updating stock:', error); // Error handling
      setError('Error updating stock');
    }
  };

// Function to delete a product
const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/products/${id}`); // Use DELETE method
    setProducts(products.filter(product => product._id !== id)); // Update the UI after successful deletion
    console.log(response.data.message); // Log success message for confirmation
  } catch (error) {
    console.error('Error deleting product:', error); // Log the error for debugging
    setError('Error deleting product'); // Set error message in state
  }
};

 // Function to handle stock filter
const handleStockFilterChange = (e) => {
  setStockFilter(e.target.value); // Set selected filter
};

  return (
    <div className="products-page">
      <h1>Products</h1>
      {error && <p className="error-message">{error}</p>} {/* Display any errors */}
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Handle search input
      />
      
      {/* Stock Filter */}
      <select value={stockFilter} onChange={handleStockFilterChange} className="filter-dropdown">
        <option value="all">All</option>
        <option value="in-stock">In Stock</option>
        <option value="out-of-stock">Out of Stock</option>
      </select>

      <ul className="product-list">
        {products
          .filter(product => 
            (product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (product.whereToBuy && product.whereToBuy.toLowerCase().includes(searchQuery.toLowerCase()))) && 
            (stockFilter === 'all' || (stockFilter === 'in-stock' && product.stock > 0) || (stockFilter === 'out-of-stock' && product.stock === 0))
          )
          .map(product => (
            <li key={product._id} className="product-item">
              <span>{product.name} - {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
              <span><strong>Where to Buy:</strong> {product.whereToBuy || 'Not available'}</span> {/* Display the Where to Buy field */}
              <button onClick={() => updateStock(product._id, product.stock + 1)}>+</button>
              <button onClick={() => updateStock(product._id, product.stock - 1)}>-</button>
              <button onClick={() => deleteProduct(product._id)} className="delete-button">Delete</button> {/* Add delete button */}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Products;
