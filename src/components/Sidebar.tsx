import { Link } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

const Sidebar = () => {
    const user = useAppSelector(state => state.auth.user); // Get logged-in user from Redux
    const role = user?.role ?? "";                        // Extract role safely, fallback to empty string

    return (
        <div className="col-2 bg-light border-end p-3 vh-100">
            <h5 className="mb-3">Menu</h5>
            <ul className="nav flex-column">
                {role === "Admin" && (
                    <>
                        <li className="nav-item">
                            <Link className="nav-link" to="/admin/users">Users</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/admin/suppliers">Suppliers</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/admin/tenders">Tenders</Link>
                        </li>
                    </>
                )}

                {role === "Pharmacist" && (
                    <>
                        <li className="nav-item">
                            <Link className="nav-link" to="/pharmacist/medicines">Medicines</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/pharmacist/batches">Batches</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/pharmacist/alerts">Alerts</Link>
                        </li>
                    </>
                )}

                {role === "Doctor" && (
                    <li className="nav-item">
                        <Link className="nav-link" to="/doctor/prescriptions">Prescriptions</Link>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
