import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';

// Placeholder for icons
const IconPlaceholder = ({ className = "icon-placeholder-default" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
  </svg>
);

const ChartIcon = ({ className = "icon-placeholder-default" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
  </svg>
);

const CheckCircleIcon = ({ className = "icon-placeholder-default" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
  </svg>
);

export default function LandingPage() {
  const [visibleSections, setVisibleSections] = useState({});
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
            // entry.target.classList.add('is-visible'); // Alternative: directly add class
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const addSectionRef = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  const Navbar = () => (
    <nav className="navbar">
      <div className="container navbar-container">
        <a href="#" className="navbar-brand">
          StoreIT
        </a>
        <div className="navbar-links">
          <a href="#features" className="navbar-link">Features</a>
          <a href="#showcase" className="navbar-link">Showcase</a>
          <a href="#cta" className="button navbar-cta-button">
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );

  const Hero = () => (
    <section id="hero" className="hero-section">
      <div className="container hero-content">
        <h1 className="hero-title animate-fade-in-down">
          <span className="hero-title-highlight">Streamline</span> Your Inventory,
          <br />
          <span className="hero-title-highlight">Amplify</span> Your Growth.
        </h1>
        <p className="hero-subtitle animate-fade-in-up animation-delay-300">
          StoreIT offers a cutting-edge, intuitive platform to manage your stock, track sales, and gain actionable insights with powerful data visualization.
        </p>
        <a
          href="./Dashboard"
          className="button hero-cta-button animate-fade-in-up animation-delay-600"
        >
          Discover the Future of Inventory
        </a>
      </div>
    </section>
  );

  const FeatureCard = ({ icon, title, description, delay = 0 }) => (
    <div
      className="feature-card animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="feature-card-icon">{icon}</div>
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-description">{description}</p>
    </div>
  );

  const Features = () => (
    <section id="features" ref={addSectionRef} className={`features-section ${visibleSections['features'] ? 'is-visible' : ''}`}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Why Choose <span className="section-title-highlight">StoreIT</span>?</h2>
          <p className="section-subtitle">Unlock efficiency and clarity in your operations.</p>
        </div>
        <div className="features-grid">
          <FeatureCard
            icon={<ChartIcon className="icon-large" />}
            title="Real-time Data Visualization"
            description="Instantly understand your inventory levels, sales trends, and supply chain with dynamic charts and dashboards."
            delay={100}
          />
          <FeatureCard
            icon={<IconPlaceholder className="icon-large icon-sky" />}
            title="Automated Reordering"
            description="Set smart alerts and automate purchase orders to prevent stockouts and overstocking."
            delay={250}
          />
          <FeatureCard
            icon={<CheckCircleIcon className="icon-large icon-green" />}
            title="Multi-location Management"
            description="Effortlessly manage inventory across multiple warehouses or stores from a single, centralized platform."
            delay={400}
          />
          <FeatureCard
            icon={<IconPlaceholder className="icon-large icon-sky" />}
            title="Seamless Integrations"
            description="Connect StoreIT with your existing e-commerce platforms, accounting software, and shipping carriers."
            delay={550}
          />
          <FeatureCard
            icon={<IconPlaceholder className="icon-large icon-sky" />}
            title="Comprehensive Reporting"
            description="Generate detailed reports on sales, inventory turnover, profit margins, and more to make data-driven decisions."
            delay={700}
          />
          <FeatureCard
            icon={<IconPlaceholder className="icon-large icon-sky" />}
            title="User-Friendly Interface"
            description="Enjoy a clean, intuitive design that makes inventory management simple and efficient for everyone on your team."
            delay={850}
          />
        </div>
      </div>
    </section>
  );

  const InteractiveShowcase = () => {
    const initialData = [
      { name: 'Product A', value: 65, colorClass: 'chart-bar-sky' },
      { name: 'Product B', value: 59, colorClass: 'chart-bar-teal' },
      { name: 'Product C', value: 80, colorClass: 'chart-bar-indigo' },
      { name: 'Product D', value: 81, colorClass: 'chart-bar-pink' },
      { name: 'Product E', value: 56, colorClass: 'chart-bar-amber' },
    ];
    const [chartData, setChartData] = useState(initialData.map(d => ({ ...d, displayValue: 0 })));

    useEffect(() => {
      const section = document.getElementById('showcase-chart-container'); // Target a more specific element if needed
      if (!section) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setTimeout(() => {
              setChartData(initialData.map(d => ({ ...d, displayValue: d.value })));
            }, 200);
            observer.unobserve(section);
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(section);
      return () => { observer.unobserve(section); };
    }, []);


    return (
      <section id="showcase" ref={addSectionRef} className={`showcase-section ${visibleSections['showcase'] ? 'is-visible' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Visualize Your <span className="section-title-highlight">Success</span></h2>
            <p className="section-subtitle">See how StoreIT brings clarity to your complex inventory data.</p>
          </div>
          <div id="showcase-chart-container" className="showcase-chart-wrapper">
            <div className="showcase-chart-header">
              <h3 className="showcase-chart-title">Monthly Sales Performance (Mock Data)</h3>
            </div>
            <div className="showcase-chart">
              {chartData.map((item, index) => (
                <div key={index} className="chart-bar-item">
                  <div
                    className={`chart-bar ${item.colorClass}`}
                    style={{ height: `${item.displayValue}%` }}
                    title={`${item.name}: ${item.value} units`}
                  >
                    <span className="sr-only">{`${item.name}: ${item.value} units`}</span>
                  </div>
                  <p className="chart-bar-label">{item.name}</p>
                </div>
              ))}
            </div>
            <p className="showcase-chart-footnote">
              *This is a simplified visual representation. Actual dashboards offer more detail and interactivity.
            </p>
          </div>
        </div>
      </section>
    );
  };

  const CTA = () => (
    <section id="cta" ref={addSectionRef} className={`cta-section ${visibleSections['cta'] ? 'is-visible' : ''}`}>
      <div className="container cta-content">
        <h2 className="cta-title">Ready to Transform Your Inventory Management?</h2>
        <p className="cta-subtitle">
          Join hundreds of businesses thriving with StoreIT. Sign up today for a free trial or request a personalized demo.
        </p>
        <div className="cta-buttons">
          <a href="#" className="button cta-button-primary">
            Start Free Trial
          </a>
          <a href="#" className="button cta-button-secondary">
            Request a Demo
          </a>
        </div>
      </div>
    </section>
  );

  const Footer = () => (
    <footer className="footer">
      <div className="container footer-content">
        <p className="footer-brand">StoreIT</p>
        <p className="footer-copyright">&copy; {new Date().getFullYear()} StoreIT. All rights reserved.</p>
        <p className="footer-credits">Built with React.</p>
        <div className="footer-links">
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
          <a href="#" className="footer-link">Contact Us</a>
        </div>
      </div>
    </footer>
  );

  return (
    <>
      <div className="app-wrapper">
        <Navbar />
        <Hero />
        <Features />
        <InteractiveShowcase />
        <CTA />
        <Footer />
      </div>
    </>
  );
};