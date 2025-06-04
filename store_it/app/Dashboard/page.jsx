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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch products count
        const productsRes = await fetch('/api/product');
        const products = await productsRes.json();
        
        // Fetch companies count
        const companiesRes = await fetch(`/api/companies?ownerId=${user?.UserID}`);
        const companies = companiesRes.ok ? await companiesRes.json() : [];
        
        // Fetch transactions count (if API exists)
        let transactionCount = 0;
        try {
          const transactionsRes = await fetch(`/api/transactions?userId=${user?.UserID}`);
          if (transactionsRes.ok) {
            const transactions = await transactionsRes.json();
            // Count recent transactions (last 7 days)
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            transactionCount = transactions.filter(t => 
              new Date(t.Timestamp) > weekAgo
            ).length;
          }
        } catch (transactionError) {
          console.log('Transactions API not available');
        }
        
        // Calculate metrics
        const totalProducts = products.length;
        const lowStockProducts = products.filter(p => p.quantity < 10);
        
        setDashboardData({
          totalProducts,
          lowStockCount: lowStockProducts.length,
          recentTransactions: transactionCount,
          activeCompanies: companies.length
        });
        
        setLowStockProducts(lowStockProducts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="app-layout">
      <Navbar />

      <div className="main-content">
        <Sidebar />

        <div className="page-content dashboard-content">
          {/* Welcome Section */}
          <div className="dashboard-welcome">
            <h1>{getGreeting()}, {user?.Username}!</h1>
            <p>Here's what's happening with your inventory today.</p>
          </div>

          {/* Key Metrics */}
          <div className="dashboard-metrics">
            <div className={`metric-card ${isLoading ? 'loading' : ''}`}>
              <h3>📦 Total Products</h3>
              <span className="metric-value">{dashboardData.totalProducts}</span>
            </div>
            <div className={`metric-card ${isLoading ? 'loading' : ''}`}>
              <h3>⚠️ Low Stock Items</h3>
              <span className="metric-value warning">{dashboardData.lowStockCount}</span>
            </div>
            <div className={`metric-card ${isLoading ? 'loading' : ''}`}>
              <h3>📊 Recent Transactions</h3>
              <span className="metric-value">{dashboardData.recentTransactions}</span>
            </div>
            <div className={`metric-card ${isLoading ? 'loading' : ''}`}>
              <h3>🏢 Active Companies</h3>
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
                📦 Add New Product
              </button>
              <button 
                onClick={() => router.push('/Company')} 
                className="action-btn secondary"
              >
                🏢 Manage Companies
              </button>
              <button 
                onClick={() => router.push('/Transaction')} 
                className="action-btn secondary"
              >
                📊 View Transactions
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
                {lowStockProducts.length > 5 && (
                  <div className="alert-item">
                    <span className="product-name">...</span>
                    <span className="stock-level" style={{color: '#9ca3af'}}>
                      +{lowStockProducts.length - 5} more items
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;