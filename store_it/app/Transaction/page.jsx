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

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-content transaction-page-content">
          <div className="transaction-header">
            <h2>User Transactions (UserID: {targetUserId})</h2>
          </div>

          {isLoading && <p className="loading-message">Loading transactions...</p>}
          {error && <p className="error-message" style={{ color: '#f87171' }}>Error: {error}</p>}
          
          {!isLoading && !error && transactions.length === 0 && (
            <p className="no-transactions-message">No transactions found for this user.</p>
          )}

          {!isLoading && !error && transactions.length > 0 && (
            <div className="transactions-table-container">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product Name</th>
                    <th>Type</th>
                    <th>Quantity Change</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.TransactionID}>
                      <td>{transaction.TransactionID}</td>
                      <td>{transaction.ProductName} (ID: {transaction.ProductID})</td>
                      <td>{transaction.TransactionType}</td>
                      <td className={transaction.QuantityChange > 0 ? 'quantity-positive' : 'quantity-negative'}>
                        {transaction.QuantityChange > 0 ? `+${transaction.QuantityChange}` : transaction.QuantityChange}
                      </td>
                      <td>{transaction.Timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Transaction;