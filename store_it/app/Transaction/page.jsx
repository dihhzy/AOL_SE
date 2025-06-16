"use client";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import '../global.css';
import './TransactionPage.css';

function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const targetUserId = 2;

  const totalTransactions = transactions.length;
  const totalRestock = transactions.filter(t => t.TransactionType === 'restock').length;
  const totalSales = transactions.filter(t => t.TransactionType === 'sale').length;
  const totalQuantityChange = transactions.reduce((sum, t) => sum + t.QuantityChange, 0);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/transactions?userId=${targetUserId}`);
        console.log('here');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [targetUserId]);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-content transaction-page-content">
          <div className="transaction-header">
            <h2>Transaction History</h2>
          </div>

          {/* Statistics Cards */}
          {!isLoading && !error && transactions.length > 0 && (
            <div className="transaction-stats">
              <div className="stat-card">
                <h3>Total Transactions</h3>
                <p className="stat-value">{totalTransactions}</p>
              </div>
              <div className="stat-card">
                <h3>Restocks</h3>
                <p className="stat-value" style={{color: '#34d399'}}>{totalRestock}</p>
              </div>
              <div className="stat-card">
                <h3>Net Change</h3>
                <p className="stat-value" style={{color: totalQuantityChange >= 0 ? '#34d399' : '#f87171'}}>
                  {totalQuantityChange >= 0 ? '+' : ''}{totalQuantityChange}
                </p>
              </div>
            </div>
          )}

          {isLoading && <p className="loading-message">Loading transactions...</p>}
          {error && <p className="error-message">Error: {error}</p>}
          
          {!isLoading && !error && transactions.length === 0 && (
            <p className="no-transactions-message">No transactions found for this user.</p>
          )}

          {!isLoading && !error && transactions.length > 0 && (
            <div className="transactions-table-container">
              <div className="table-scroll-wrapper">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Product Details</th>
                      <th>Type</th>
                      <th>Quantity Change</th>
                      <th>Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.TransactionID}>
                        <td>
                          <span className="transaction-id">
                            #{transaction.TransactionID}
                          </span>
                        </td>
                        <td>
                          <div className="product-info">
                            <span className="product-name">{transaction.ProductName}</span>
                            <span className="product-id">ID: {transaction.ProductID}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`transaction-type ${transaction.TransactionType.toLowerCase()}`}>
                            {transaction.TransactionType}
                          </span>
                        </td>
                        <td>
                          <span className={`quantity-change ${transaction.QuantityChange > 0 ? 'quantity-positive' : 'quantity-negative'}`}>
                            {transaction.QuantityChange > 0 ? `+${transaction.QuantityChange}` : transaction.QuantityChange}
                          </span>
                        </td>
                        <td>
                          <span className="timestamp">
                            {formatTimestamp(transaction.Timestamp)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Transaction;