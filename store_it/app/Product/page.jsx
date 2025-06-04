"use client";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import './ProductPage.css'
import "../global.css";

function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: "",
    description: "",
    categoryId: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriesError, setCategoriesError] = useState(null);

  // Calculate statistics
  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, product) => sum + (product.quantity || 0), 0);
  const lowStockProducts = products.filter(product => product.quantity < 10).length;
  const averageQuantity = totalProducts > 0 ? Math.round(totalQuantity / totalProducts) : 0;

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Products
      setIsLoading(true);
      setError(null);
      try {
        const productResponse = await fetch('/api/product');
        if (!productResponse.ok) {
          const errorData = await productResponse.json();
          throw new Error(errorData.message || `HTTP error! status: ${productResponse.status}`);
        }
        const productData = await productResponse.json();
        setProducts(productData);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }

      // Fetch Categories
      setIsCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const categoryResponse = await fetch('/api/categories');
        if (!categoryResponse.ok) {
          const errorData = await categoryResponse.json();
          throw new Error(errorData.message || `HTTP error! status: ${categoryResponse.status}`);
        }
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategoriesError(err.message);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        ...newProduct,
        categoryId: newProduct.categoryId ? parseInt(newProduct.categoryId, 10) : null,
      };

      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const addedProduct = await response.json();
      
      setProducts((prevProducts) => [...prevProducts, addedProduct]);
      setNewProduct({ name: "", quantity: "", description: "", categoryId: "" });
      setShowAddForm(false); 
      alert("Product added successfully!");

    } catch (err) {
      console.error("Failed to add product:", err);
      setError(err.message);
      alert(`Error adding product: ${err.message}`);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />

      <div className="main-content">
        <Sidebar />

        <div className="page-content product-page-content">
          <div className="product-header">
            <h2>Company Products</h2>
            <button onClick={() => setShowAddForm(!showAddForm)} className="add-product-button">
              {showAddForm ? "Cancel" : "Add New Product"}
            </button>
          </div>

          {error && <p className="error-message">Error fetching products: {error}</p>}
          {categoriesError && <p className="error-message">Error fetching categories: {categoriesError}</p>}

          {/* Product Statistics */}
          {!isLoading && !error && products.length > 0 && (
            <div className="product-stats">
              <div className="stat-card">
                <h3>Total Products</h3>
                <p className="stat-value">{totalProducts}</p>
              </div>
              <div className="stat-card">
                <h3>Total Quantity</h3>
                <p className="stat-value" style={{color: '#10b981'}}>{totalQuantity}</p>
              </div>
              <div className="stat-card">
                <h3>Low Stock Items</h3>
                <p className="stat-value" style={{color: lowStockProducts > 0 ? '#f59e0b' : '#10b981'}}>
                  {lowStockProducts}
                </p>
              </div>
              <div className="stat-card">
                <h3>Average Quantity</h3>
                <p className="stat-value" style={{color: '#38bdf8'}}>{averageQuantity}</p>
              </div>
            </div>
          )}

          {showAddForm && (
            <div className="add-product-form-container">
              <h3>Add New Product</h3>
              <form onSubmit={handleAddProduct} className="add-product-form">
                <div className="form-group">
                  <label htmlFor="name">Product Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter product name..."
                    value={newProduct.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    placeholder="Enter quantity..."
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Enter product description..."
                    value={newProduct.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="categoryId">Category</label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={newProduct.categoryId}
                    onChange={handleInputChange}
                    required 
                  >
                    <option value="">Select a Category</option>
                    {isCategoriesLoading ? (
                      <option value="" disabled>Loading categories...</option>
                    ) : (
                      categories.map(category => (
                        <option key={category.CategoryID} value={category.CategoryID}>
                          {category.CategoryName}
                        </option>
                      ))
                    )}
                  </select>
                  {categoriesError && !isCategoriesLoading && <p style={{color: '#fca5a5', fontSize: '0.8em'}}>Could not load categories.</p>}
                </div>
                <button type="submit" className="submit-product-button">Add Product</button>
              </form>
            </div>
          )}

          {isLoading ? (
            <p className="loading-message">Loading products...</p>
          ) : products.length > 0 ? (
            <div className="product-list-display">
              {products.map(product => (
                <div key={product.id} className="product-item-card">
                  <h4>{product.name}</h4>
                  <p>Quantity: {product.quantity}</p>
                  <p>Description: {product.description || "No description available"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-products-message">
              {error ? 'Could not load products.' : 'No products to display.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;