import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Sidebar from "../../components/Sidebar.tsx";
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } from "../../api/suppliers.api";
import type { Supplier } from "../../api/suppliers.api";

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");
    const [editingSupplierId, setEditingSupplierId] = useState<number | null>(null);

    // Load suppliers
    useEffect(() => {
        const loadSuppliers = async () => {
            try {
                const data = await fetchSuppliers();
                setSuppliers(data);
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Failed to load suppliers", "error");
            }
        };
        loadSuppliers();
    }, []);

    // Create or update supplier
    const handleCreateOrUpdate = async () => {
        if (!name || !contact || !address) {
            Swal.fire("Warning", "All fields are required", "warning");
            return;
        }

        try {
            if (editingSupplierId) {
                await updateSupplier(editingSupplierId, { name, contact, address });
                Swal.fire("Success", "Supplier updated successfully", "success");
            } else {
                await createSupplier({ name, contact, address });
                Swal.fire("Success", "Supplier created successfully", "success");
            }

            // Reset form
            setName("");
            setContact("");
            setAddress("");
            setEditingSupplierId(null);

            // Reload suppliers
            const data = await fetchSuppliers();
            setSuppliers(data);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", editingSupplierId ? "Failed to update supplier" : "Failed to create supplier", "error");
        }
    };

    // Edit supplier
    const handleEdit = (supplier: Supplier) => {
        setEditingSupplierId(supplier.id);
        setName(supplier.name);
        setContact(supplier.contact ?? "");
        setAddress(supplier.address ?? "");
    };

    // Cancel edit
    const handleCancelEdit = () => {
        setEditingSupplierId(null);
        setName("");
        setContact("");
        setAddress("");
    };

    // Delete supplier
    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                await deleteSupplier(id);
                const data = await fetchSuppliers();
                setSuppliers(data);
                Swal.fire("Deleted!", "Supplier has been deleted.", "success");
            } catch (err) {
                Swal.fire("Error", (err as Error).message, "error");
            }
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column p-0">
            <div className="row flex-grow-1">
                <Sidebar />
                <div className="col-10 p-4 bg-light">
                    <h2>Suppliers</h2>

                    <div className="mb-3">
                        <input
                            className="form-control mb-2"
                            placeholder="Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <input
                            className="form-control mb-2"
                            placeholder="Contact"
                            value={contact}
                            onChange={e => setContact(e.target.value)}
                        />
                        <input
                            className="form-control mb-2"
                            placeholder="Address"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                        />
                        <div className="d-flex gap-2">
                            <button className="btn btn-success" onClick={handleCreateOrUpdate}>
                                {editingSupplierId ? "Update Supplier" : "Create Supplier"}
                            </button>
                            {editingSupplierId && (
                                <button className="btn btn-secondary" onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Address</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map(s => (
                                <tr key={s.id}>
                                    <td>{s.name}</td>
                                    <td>{s.contact}</td>
                                    <td>{s.address}</td>
                                    <td className="d-flex gap-2">
                                        <button className="btn btn-primary btn-sm" onClick={() => handleEdit(s)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>
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

export default SupplierList;
