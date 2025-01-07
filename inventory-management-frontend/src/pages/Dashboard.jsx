import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import Axios
import '../styles/Dashboard.css';

function Dashboard() {
  const [products, setProducts] = useState([]); // State to store products
  const [totalProducts, setTotalProducts] = useState(0); // State for total products
  const [totalStock, setTotalStock] = useState(0);       // State for total stock

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://13.247.60.72:5000/api/products'); // Call to the backend API
        const products = response.data;

        setProducts(products);
        // Calculate total products and total stock
        setTotalProducts(products.length);
        const stockSum = products.reduce((acc, product) => acc + product.stock, 0);
        setTotalStock(stockSum);
      } catch (error) {
        console.error('Error fetching dashboard data:', error); // Error handling
      }
    };

    fetchDashboardData(); // Call the fetch function
  }, []); // Empty dependency array to run only once

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-item">
          <h2>Total Products</h2>
          <p>{totalProducts}</p>
        </div>
        <div className="stat-item">
          <h2>Total Stock</h2>
          <p>{totalStock}</p>
        </div>
      </div>
{/* Display All Products */}
<div className="product-list">
        <h2>All Products</h2>
        <ul>
          {products.map(product => (
            <li key={product._id} className="product-item">
              <span><strong>{product.name}</strong> - {product.stock} in stock</span>
              {product.whereToBuy && (
                <span><strong>Where to Buy:</strong> {product.whereToBuy}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
