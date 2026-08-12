import { useState } from "react";                            // React state
import { useNavigate } from "react-router-dom";              // Navigation
import { useAppDispatch } from "../store/hooks";             // Redux dispatch
import { loginSuccess } from "../store/authSlice";           // Auth action
import { loginUser } from "../api/auth.api";                 // API call

const Login = () => {
    const navigate = useNavigate();                          // Router navigation
    const dispatch = useAppDispatch();                       // Redux dispatcher

    const [email, setEmail] = useState("");                  // Email input
    const [password, setPassword] = useState("");            // Password input
    const [error, setError] = useState("");                  // Error message

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();                                  // Prevent form reload
        setError("");                                        // Reset error

        try {
            const loggedInUser = await loginUser(email, password); // API login

            dispatch(loginSuccess(loggedInUser));            // Store user in Redux

            switch (loggedInUser.role) {                     // Role-based routing
                case "Admin":
                    navigate("/admin/dashboard");
                    break;
                case "Pharmacist":
                    navigate("/pharmacist/dashboard");
                    break;
                case "Doctor":
                    navigate("/doctor/dashboard");
                    break;
                default:
                    navigate("/dashboard");
            }
        } catch (err: unknown) {
            type AxiosLike = { response?: { data?: { message?: string } } };
            const message =
                typeof err === "object" && err !== null && "response" in err
                    ? (err as AxiosLike).response?.data?.message
                    : undefined;

            setError(message || "Login failed");              // Show error
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <form
                onSubmit={handleLogin}
                className="bg-white p-5 rounded shadow"
                style={{ width: "100%", maxWidth: "400px" }}
            >
                <h1 className="mb-4 text-center">Hospital Login</h1>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
