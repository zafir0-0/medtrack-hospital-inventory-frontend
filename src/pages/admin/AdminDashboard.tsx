import Sidebar from "../../components/Sidebar.tsx";
import { useAppSelector } from "../../store/hooks"; // Redux selector

const AdminDashboard = () => {
    const user = useAppSelector(state => state.auth.user); // get user from Redux

    return (
        <div className="container-fluid vh-100 d-flex flex-column p-0">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        Hospital Inventory
                    </a>
                    <div className="d-flex">
                        <span className="navbar-text text-white">{user?.fullName}</span>
                    </div>
                </div>
            </nav>

            <div className="row flex-grow-1">
                <Sidebar /> {/* role is handled inside Sidebar via Redux */}
                <div className="col-10 p-4 bg-light">
                    <h1>Admin Dashboard</h1>
                    <p>Access: Users, Suppliers, Tenders</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
