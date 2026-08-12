import Sidebar from "../../components/Sidebar.tsx";
import { useAppSelector } from "../../store/hooks"; // Redux selector

const DoctorDashboard = () => {
    const user = useAppSelector(state => state.auth.user); // Get logged-in user from Redux

    return (
        <div className="container-fluid vh-100 d-flex flex-column p-0">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        Hospital Inventory - Doctor
                    </a>
                    <div className="d-flex">
                        <span className="navbar-text text-white">{user?.fullName}</span>
                    </div>
                </div>
            </nav>

            <div className="row flex-grow-1">
                {/* Sidebar reads role from Redux now */}
                <Sidebar />

                {/* Main Content */}
                <div className="col-10 p-4 bg-light">
                    <h1>Welcome, Dr. {user?.fullName}</h1>
                    <p className="mb-4">Role: {user?.role}</p>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
