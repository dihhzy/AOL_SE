// components/HomeContent.jsx
import React from 'react';
import './HomeContent.css';

const steps = [
  {
    title: "Connect Your Products",
    description: "Import your inventory or sync with your e-commerce platform in just a few clicks.",
    icon: "🔗"
  },
  {
    title: "Automate Tracking",
    description: "StoreIT monitors your stock, sales, and restocking needs in real time.",
    icon: "📦"
  },
  {
    title: "Visualize & Optimize",
    description: "Use powerful dashboards to analyze trends and make data-driven decisions.",
    icon: "📊"
  },
];

export default function HomeContent() {
  return (
    <section className="home-content-section">
      <div className="container home-content-container">
        <h2 className="home-content-title">How <span>StoreIT</span> Works</h2>
        <p className="home-content-subtitle">Get started in 3 easy steps.</p>
        <div className="home-steps">
          {steps.map((step, index) => (
            <div key={index} className="home-step-card">
              <div className="home-step-icon">{step.icon}</div>
              <h3 className="home-step-title">{step.title}</h3>
              <p className="home-step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
