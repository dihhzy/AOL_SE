"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from 'jotai';
import { userAtom } from '../lib/userAtom';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductGrid from "../components/ProductGrid";
import "./Dashboard.css";
import '../global.css';
import HomeContent from '../components/HomeContent';

function Dashboard() {
  const [user] = useAtom(userAtom);
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    recentTransactions: 0,
    activeCompanies: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Fetch products count
        const productsRes = await fetch('/api/product');
        const products = await productsRes.json();
        
        // Calculate metrics
        const totalProducts = products.length;
        const lowStockProducts = products.filter(p => p.quantity < 10);
        
        setDashboardData({
          totalProducts,
          lowStockCount: lowStockProducts.length,
          recentTransactions: 0, // Implement based on your transaction API
          activeCompanies: 1 // Implement based on your companies API
        });
        
        setLowStockProducts(lowStockProducts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return (
    <div className="app-layout">
      <Navbar />

      <div className="main-content">
        <Sidebar />

        <div className="page-content dashboard-content">
          {/* Welcome Section */}
          <div className="dashboard-welcome">
            <h1>Welcome back, {user?.Username}!</h1>
            <p>Here's what's happening with your inventory today.</p>
          </div>

          {/* Key Metrics */}
          <div className="dashboard-metrics">
            <div className="metric-card">
              <h3>Total Products</h3>
              <span className="metric-value">{dashboardData.totalProducts}</span>
            </div>
            <div className="metric-card">
              <h3>Low Stock Items</h3>
              <span className="metric-value warning">{dashboardData.lowStockCount}</span>
            </div>
            <div className="metric-card">
              <h3>Recent Transactions</h3>
              <span className="metric-value">{dashboardData.recentTransactions}</span>
            </div>
            <div className="metric-card">
              <h3>Active Companies</h3>
              <span className="metric-value">{dashboardData.activeCompanies}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button 
                onClick={() => router.push('/Product')} 
                className="action-btn primary"
              >
                Add New Product
              </button>
              <button 
                onClick={() => router.push('/Company')} 
                className="action-btn secondary"
              >
                Manage Companies
              </button>
              <button 
                onClick={() => router.push('/Transaction')} 
                className="action-btn secondary"
              >
                Record Transaction
              </button>
            </div>
          </div>

          {/* Low Stock Alerts */}
          {lowStockProducts.length > 0 && (
            <div className="stock-alerts">
              <h2>Stock Alerts</h2>
              <div className="alert-list">
                {lowStockProducts.slice(0, 5).map(product => (
                  <div key={product.id} className="alert-item">
                    <span className="product-name">{product.name}</span>
                    <span className="stock-level danger">{product.quantity} remaining</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How StoreIT Works Section */}
          <div className="dashboard-info">
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;