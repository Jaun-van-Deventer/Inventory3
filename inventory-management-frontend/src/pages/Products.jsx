import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Products.css';

function Products() {
  const [products, setProducts] = useState([]); // State to store products
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [stockFilter, setStockFilter] = useState('all'); // State for stock filter
  const [sortOption, setSortOption] = useState('none'); // State for sorting
  const [error, setError] = useState(''); // State for error handling
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products'); // Call to the backend API
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
      await axios.put(`/api/products/${id}`, { stock: newStock }); // Call to update stock in the backend
      setProducts(products.map(product => product._id === id ? { ...product, stock: newStock } : product)); // Update local state
    } catch (error) {
      console.error('Error updating stock:', error); // Error handling
      setError('Error updating stock');
    }
  };

  // Function to delete a product
  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`/api/products/${id}`); // Use DELETE method
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

  // Function to handle sort option change
  const handleSortOptionChange = (e) => {
    setSortOption(e.target.value); // Set selected sort option
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  const saveEdit = async () => {
    try {
      await axios.put(`/api/products/${editingProduct._id}`, editingProduct);
      // Update the product list after successful edit
      setProducts(products.map(product => product._id === editingProduct._id ? editingProduct : product));
      setEditingProduct(null);
    } catch (error) {
      console.error("Failed to update product", error);
    }
  };

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product =>
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.whereToBuy && product.whereToBuy.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (stockFilter === 'all' || (stockFilter === 'in-stock' && product.stock > 0) || (stockFilter === 'out-of-stock' && product.stock === 0))
    )
    .sort((a, b) => {
      if (sortOption === 'low-stock') {
        return a.stock - b.stock; // Sort by low stock (ascending)
      }
      if (sortOption === 'high-stock') {
        return b.stock - a.stock; // Sort by high stock (descending)
      }
      return 0; // Default order (no sorting)
    });

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

      {/* Sort Dropdown */}
      <select value={sortOption} onChange={handleSortOptionChange} className="sort-dropdown">
        <option value="none">No Sorting</option>
        <option value="low-stock">Low Stock</option>
        <option value="high-stock">High Stock</option>
      </select>

      <ul className="product-list">
        {filteredAndSortedProducts.map(product => (
          <li key={product._id} className="product-item">
            <span>{product.name} - {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
            <span><strong>Where to Buy:</strong> {product.whereToBuy || 'Not available'}</span> {/* Display the Where to Buy field */}
            <span><strong>Description:</strong> {product.description || 'No description available'}</span> {/* Add description */}
            <button onClick={() => updateStock(product._id, product.stock + 1)}>+</button>
            <button onClick={() => updateStock(product._id, product.stock - 1)}>-</button>
            <button onClick={() => deleteProduct(product._id)} className="delete-button">Delete</button> {/* Add delete button */}
            <button onClick={() => setEditingProduct(product)} className="edit-button">Edit</button> {/* Add edit button */}
          </li>
        ))}
      </ul>
      {editingProduct && (
        <div className="edit-form">
          <h3>Edit Product</h3>
          <input
            type="text"
            name="name"
            value={editingProduct.name}
            onChange={handleEditChange}
            placeholder="Product Name"
          />
          <input
            type="number"
            name="stock"
            value={editingProduct.stock}
            onChange={handleEditChange}
            placeholder="Stock Quantity"
          />
          <input
            type="text"
            name="whereToBuy"
            value={editingProduct.whereToBuy}
            onChange={handleEditChange}
            placeholder="Where to Buy"
          />
          <textarea
            name="description"
            value={editingProduct.description || ''}
            onChange={handleEditChange}
            placeholder="Product Description"
          ></textarea> {/* Add a textarea for the description */}
          <button onClick={saveEdit}>Save</button>
          <button onClick={() => setEditingProduct(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Products;
