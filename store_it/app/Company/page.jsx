"use client";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from '../lib/userAtom';

import { useRouter } from "next/navigation";
import './CompanyPage.css';
import "../global.css";

function CompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionUser] = useAtom(userAtom);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!sessionUser) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/companies?ownerId=${sessionUser.UserID}`);
        if (!response.ok) throw new Error((await response.json()).message);
        const data = await response.json();
        setCompanies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [sessionUser]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/companies/${selectedCompany.CompanyID}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete company');
      setCompanies(companies.filter(c => c.CompanyID !== selectedCompany.CompanyID));
    } catch (err) {
      alert('Error deleting company: ' + err.message);
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-content company-page-content">
          <div className="company-header">
            <h2>Your Companies</h2>
          </div>

          {error && <p className="error-message">{error}</p>}
          {isLoading ? (
            <p>Loading companies...</p>
          ) : companies.length > 0 ? (
            <div className="company-list-display">
              {companies.map(company => (
                <div key={company.CompanyID} className="company-item-card">
                  <div className="company-card-top">
                    <h4>{company.CompanyName}</h4>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        setSelectedCompany(company);
                        setShowConfirm(true);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                  <p>Email: {company.Email}</p>
                  <p>Created At: {new Date(company.CreatedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No companies to display.</p>
          )}

          {showConfirm && (
            <div className="modal-overlay">
              <div className="confirm-modal">
                <p>Are you sure you want to delete <strong>{selectedCompany.CompanyName}</strong>?</p>
                <div className="modal-actions">
                  <button onClick={() => setShowConfirm(false)} className="cancel-btn">Cancel</button>
                  <button onClick={handleDelete} className="delete-confirm-btn">Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyPage;