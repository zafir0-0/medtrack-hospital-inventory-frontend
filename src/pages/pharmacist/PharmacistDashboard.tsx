import Sidebar from "../../components/Sidebar.tsx";
import { useAppSelector } from "../../store/hooks";

const PharmacistDashboard = () => {
    const user = useAppSelector(state => state.auth.user);

    return (
        <div className="container-fluid vh-100 d-flex flex-column p-0">
            <nav className="navbar navbar-expand-lg navbar-dark bg-success">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Hospital Inventory</a>
                    <div className="d-flex">
                        <span className="navbar-text text-white">{user?.fullName}</span>
                    </div>
                </div>
            </nav>

            <div className="row flex-grow-1">
                {/* Sidebar no longer needs role prop */}
                <Sidebar />

                <div className="col-10 p-4 bg-light">
                    <h1>Pharmacist Dashboard</h1>
                    <p>Manage Medicines, Batches, and Alerts</p>
                </div>
            </div>
        </div>
    );
};

export default PharmacistDashboard;
