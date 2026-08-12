import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Sidebar from "../../components/Sidebar.tsx";
import { fetchUsers, createUser, updateUser, deleteUser } from "../../api/users.api";

interface User {
    id: number;
    fullName: string;
    email: string;
    role: string;
}

const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState("Admin");
    const [editingUserId, setEditingUserId] = useState<number | null>(null);

    // Load all users
    const loadUsers = async () => {
        try {
            const data = await fetchUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to fetch users", "error");
        }
    };

    // Load users on component mount
    useEffect(() => {
        (async () => { await loadUsers(); })();
    }, []);

    // Create or Update user
    const handleCreateOrUpdate = async () => {
        if (!fullName || !email) {
            Swal.fire("Warning", "Full Name and Email are required", "warning");
            return;
        }

        try {
            if (editingUserId) {
                await updateUser(editingUserId, { fullName, email, role });
                Swal.fire("Success", "User updated successfully", "success");
            } else {
                await createUser({ fullName, email, role });
                Swal.fire("Success", "User created successfully", "success");
            }

            // Reset form
            setFullName("");
            setEmail("");
            setRole("Admin");
            setEditingUserId(null);

            await loadUsers();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", editingUserId ? "Failed to update user" : "Failed to create user", "error");
        }
    };

    // Delete user
    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This user will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
        });

        if (result.isConfirmed) {
            try {
                await deleteUser(id);
                await loadUsers();
                Swal.fire("Deleted!", "User deleted successfully", "success");
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Failed to delete user", "error");
            }
        }
    };

    // Load user data into form for editing
    const handleEdit = (user: User) => {
        setEditingUserId(user.id);
        setFullName(user.fullName);
        setEmail(user.email);
        setRole(user.role);
    };

    // Cancel edit mode
    const handleCancelEdit = () => {
        setEditingUserId(null);
        setFullName("");
        setEmail("");
        setRole("Admin");
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column p-0">
            <div className="row flex-grow-1">
                <Sidebar />

                <div className="col-10 p-4 bg-light">
                    <h2>Users</h2>

                    <div className="mb-3">
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="form-control mb-2"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            className="form-control mb-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <select
                            className="form-select mb-2"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option>Admin</option>
                            <option>Pharmacist</option>
                            <option>Doctor</option>
                        </select>

                        <div className="d-flex gap-2">
                            <button className="btn btn-success" onClick={handleCreateOrUpdate}>
                                {editingUserId ? "Update User" : "Create User"}
                            </button>
                            {editingUserId && (
                                <button className="btn btn-secondary" onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.fullName}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td className="d-flex gap-2">
                                        <button className="btn btn-primary btn-sm" onClick={() => handleEdit(u)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserList;
