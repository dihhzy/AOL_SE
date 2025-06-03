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
  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!sessionUser) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/companies?ownerId=${sessionUser.UserID}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-content company-page-content">
          <div className="company-header">
            <h2>Your Companies</h2>
          </div>

          {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

          {isLoading ? (
            <p>Loading companies...</p>
          ) : companies.length > 0 ? (
            <div className="company-list-display">
              {companies.map(company => (
                <div
                  key={company.CompanyID}
                  className="company-item-card"
                  onClick={() => router.push('/Product')}
                  style={{ cursor: 'pointer' }}
                >
                  <h4>{company.CompanyName}</h4>
                  <p>Email: {company.Email}</p>
                  <p>Created At: {new Date(company.CreatedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No companies to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyPage;
