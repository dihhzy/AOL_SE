import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductGrid from "../components/ProductGrid";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="app-layout">
      <Navbar />

      <div className="main-content">
        <>
          <Sidebar />
        </>

        <div className="page-content">
            <ProductGrid itemCount={8} />{" "}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
