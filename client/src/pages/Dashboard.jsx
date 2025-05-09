import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import './Dashboard.css';

function Dashboard() {


    return (
        <div className="app-layout">

            <Navbar />


            <div className="main-content">
                
                <>
                    <Sidebar />
                </>
                
                <div className="page-content">
                    <div>
                        Content
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default Dashboard;