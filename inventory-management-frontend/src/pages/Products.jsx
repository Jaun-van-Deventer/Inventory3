import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortOption, setSortOption] = useState('none');
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  // Ref for the edit form
  const editFormRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products');
      }
    };

    fetchProducts();
  }, []);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    if (editFormRef.current) {
      editFormRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to the edit form
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  const saveEdit = async () => {
    try {
      await axios.put(`/api/products/${editingProduct._id}`, editingProduct);
      setProducts(products.map(product => product._id === editingProduct._id ? editingProduct : product));
      setEditingProduct(null);
    } catch (error) {
      console.error('Failed to update product', error);
    }
  };

  const filteredAndSortedProducts = products
    .filter(product =>
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.whereToBuy && product.whereToBuy.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (stockFilter === 'all' || (stockFilter === 'in-stock' && product.stock > 0) || (stockFilter === 'out-of-stock' && product.stock === 0))
    )
    .sort((a, b) => {
      if (sortOption === 'low-stock') {
        return a.stock - b.stock;
      }
      if (sortOption === 'high-stock') {
        return b.stock - a.stock;
      }
      return 0;
    });

  return (
    <div className="products-page">
      <h1>Products</h1>
      {error && <p className="error-message">{error}</p>}

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Stock Filter */}
      <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="filter-dropdown">
        <option value="all">All</option>
        <option value="in-stock">In Stock</option>
        <option value="out-of-stock">Out of Stock</option>
      </select>

      {/* Sort Dropdown */}
      <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="sort-dropdown">
        <option value="none">No Sorting</option>
        <option value="low-stock">Low Stock</option>
        <option value="high-stock">High Stock</option>
      </select>

      <ul className="product-list">
        {filteredAndSortedProducts.map(product => (
          <li key={product._id} className="product-item">
            <span><strong>Product:</strong> {product.name}</span>
            <span><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
            <span><strong>Where to Buy:</strong> {product.whereToBuy || 'Not available'}</span>
            <span><strong>Description:</strong> {product.description || 'No description available'}</span>
            <button onClick={() => handleEditProduct(product)} className="edit-button">Edit</button>
          </li>
        ))}
      </ul>

      {editingProduct && (
        <div ref={editFormRef} className="edit-form">
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
          <input
            type="text"
            name="description"
            value={editingProduct.description || ''}
            onChange={handleEditChange}
            placeholder="Product Description"
          />
          <button onClick={saveEdit}>Save</button>
          <button onClick={() => setEditingProduct(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Products;
