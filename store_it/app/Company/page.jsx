"use client";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../lib/userAtom";
import { useRouter } from "next/navigation";
import "./CompanyPage.css";
import "../global.css";

function CompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingCompanyId, setDeletingCompanyId] = useState(null);
  const [sessionUser] = useAtom(userAtom);
  const router = useRouter();

  const totalCompanies = companies.length;
  const recentCompanies = companies.filter((company) => {
    const createdDate = new Date(company.CreatedAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate > thirtyDaysAgo;
  }).length;

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!sessionUser) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/companies?ownerId=${sessionUser.UserID}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }
        const data = await response.json();
        setCompanies(data);
      } catch (err) {
        console.error("Failed to fetch companies:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [sessionUser]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState({
    CompanyName: "",
    Email: "",
    Password: "",
  });

  const handleAddCompany = async () => {
    try {
      const payload = {
        ...newCompany,
        OwnerUserID: sessionUser.UserID,
      };
      const res = await fetch("/api/addcompanies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add company");
      const added = await res.json();
      setCompanies((prev) => [...prev, added]);
      setShowAddModal(false);
      setNewCompany({ CompanyName: "", Email: "", Password: "" });
    } catch (err) {
      alert("Error adding company: " + err.message);
    }
  };

  const handleDeleteCompany = async (companyId, companyName) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${companyName}"?\n\nThis action cannot be undone and will remove all associated data.`
    );

    if (!isConfirmed) return;

    setDeletingCompanyId(companyId);

    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company.CompanyID !== companyId)
      );

      alert(`Company "${companyName}" has been successfully deleted.`);
    } catch (err) {
      console.error("Failed to delete company:", err);
      alert(`Error deleting company: ${err.message}`);
    } finally {
      setDeletingCompanyId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffInDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-content company-page-content">
          <div className="company-header">
            <h2>
              Your Companies{" "}
              <button
                className="add-product-button"
                onClick={() => setShowAddModal(true)}
              >
                + Add Company
              </button>{" "}
            </h2>
          </div>

          {/* Company Statistics */}
          {!isLoading && !error && companies.length > 0 && (
            <div className="company-stats">
              <div className="stat-card">
                <h3>Total Companies</h3>
                <p className="stat-value">{totalCompanies}</p>
              </div>
              <div className="stat-card">
                <h3>Recent (30 days)</h3>
                <p className="stat-value" style={{ color: "#10b981" }}>
                  {recentCompanies}
                </p>
              </div>
              <div className="stat-card">
                <h3>Active Status</h3>
                <p className="stat-value" style={{ color: "#38bdf8" }}>
                  All Active
                </p>
              </div>
            </div>
          )}

          {error && <p className="error-message">Error: {error}</p>}
          {showAddModal && (
            <div className="modal-overlay">
              <div className="confirm-modal">
                <h3>Add Company</h3>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={newCompany.CompanyName}
                  onChange={(e) =>
                    setNewCompany({
                      ...newCompany,
                      CompanyName: e.target.value,
                    })
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newCompany.Email}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, Email: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newCompany.Password}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, Password: e.target.value })
                  }
                />
                <div className="modal-actions">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCompany}
                    className="add-confirm-btn"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
          {isLoading ? (
            <p className="loading-message">Loading companies...</p>
          ) : companies.length > 0 ? (
            <div className="company-list-display">
              {companies.map((company) => (
                <div key={company.CompanyID} className="company-item-card">
                  <h4>{company.CompanyName}</h4>

                  <div className="company-info">
                    <div className="info-item">
                      <span className="info-icon">📧</span>
                      <div className="info-content">
                        <div className="info-label">Email</div>
                        <div className="info-value">{company.Email}</div>
                      </div>
                    </div>

                    <div className="info-item">
                      <span className="info-icon">📅</span>
                      <div className="info-content">
                        <div className="info-label">Created</div>
                        <div className="info-value">
                          {formatDate(company.CreatedAt)}
                        </div>
                      </div>
                    </div>

                    <div className="info-item">
                      <span className="info-icon">⏰</span>
                      <div className="info-content">
                        <div className="info-label">Time Since</div>
                        <div className="info-value">
                          {getTimeAgo(company.CreatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="company-actions">
                    <button
                      className="action-button primary"
                      onClick={() => router.push("/Product")}
                    >
                      <span>📦</span>
                      View Products
                    </button>
                    {/* <button 
                      className="action-button secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add edit functionality here
                        console.log('Edit company:', company.CompanyID);
                      }}
                    >
                      <span>✏️</span>
                      Edit
                    </button> */}
                    <button
                      className={`action-button danger ${
                        deletingCompanyId === company.CompanyID
                          ? "deleting"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCompany(
                          company.CompanyID,
                          company.CompanyName
                        );
                      }}
                      disabled={deletingCompanyId === company.CompanyID}
                    >
                      <span>
                        {deletingCompanyId === company.CompanyID ? "⏳" : "🗑️"}
                      </span>
                      {deletingCompanyId === company.CompanyID
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-companies-message">No companies to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyPage;
