import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { fetchTenders, createTender, updateTender, deleteTender } from "../../api/tenders.api";
import { fetchSuppliers } from "../../api/suppliers.api";
import type { Supplier } from "../../api/suppliers.api";
import type { Tender } from "../../api/tenders.api";
import Sidebar from "../../components/Sidebar.tsx";

export default function TenderList() {
    const [tenders, setTenders] = useState<Tender[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [tenderNumber, setTenderNumber] = useState("");
    const [supplierIdInput, setSupplierIdInput] = useState<number>(0);
    const [yearInput, setYearInput] = useState<number>(new Date().getFullYear());
    const [editingTenderId, setEditingTenderId] = useState<number | null>(null);

    // Load tenders and suppliers
    useEffect(() => {
        const loadData = async () => {
            try {
                const [tData, sData] = await Promise.all([fetchTenders(), fetchSuppliers()]);
                setTenders(tData);
                setSuppliers(sData);

                // Set default supplier selection
                const defaultSupplierId = sData.length ? sData[0].id : 0;
                setSupplierIdInput(prevId => sData.find(s => s.id === prevId)?.id ?? defaultSupplierId);
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Failed to load tenders or suppliers", "error");
            }
        };

        loadData();
    }, []);

    // Create or update tender
    const handleCreateOrUpdate = async () => {
        if (!tenderNumber || !supplierIdInput) {
            Swal.fire("Warning", "Please enter tender number and select a supplier", "warning");
            return;
        }

        try {
            if (editingTenderId) {
                await updateTender(editingTenderId, {
                    number: tenderNumber,
                    supplierId: supplierIdInput,
                    year: yearInput,
                });
                Swal.fire("Success", "Tender updated successfully", "success");
            } else {
                await createTender({
                    number: tenderNumber,
                    supplierId: supplierIdInput,
                    year: yearInput,
                });
                Swal.fire("Success", "Tender created successfully", "success");
            }

            // Reset form
            setTenderNumber("");
            setSupplierIdInput(suppliers.length ? suppliers[0].id : 0);
            setYearInput(new Date().getFullYear());
            setEditingTenderId(null);

            // Reload tenders
            const tData = await fetchTenders();
            setTenders(tData);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", editingTenderId ? "Failed to update tender" : "Failed to create tender", "error");
        }
    };

    // Delete tender
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
                await deleteTender(id);
                Swal.fire("Deleted!", "Tender has been deleted.", "success");

                const tData = await fetchTenders();
                setTenders(tData);
            } catch (err) {
                Swal.fire("Error", (err as Error).message, "error");
            }
        }
    };

    // Edit tender
    const handleEdit = (tender: Tender) => {
        setEditingTenderId(tender.id);
        setTenderNumber(tender.number);
        setSupplierIdInput(tender.supplierId);
        setYearInput(tender.year);
    };

    // Cancel edit
    const handleCancelEdit = () => {
        setEditingTenderId(null);
        setTenderNumber("");
        setSupplierIdInput(suppliers.length ? suppliers[0].id : 0);
        setYearInput(new Date().getFullYear());
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column p-0">
            <div className="row flex-grow-1">
                <Sidebar />
                <div className="col-10 p-4 bg-light">
                    <h2>Tenders</h2>

                    <div className="mb-3">
                        <div className="row g-2">
                            <div className="col-md-4">
                                <input
                                    className="form-control"
                                    placeholder="Tender number"
                                    value={tenderNumber}
                                    onChange={e => setTenderNumber(e.target.value)}
                                />
                            </div>
                            <div className="col-md-3">
                                <select
                                    className="form-select"
                                    value={supplierIdInput}
                                    onChange={e => setSupplierIdInput(Number(e.target.value))}
                                >
                                    <option value={0}>Select supplier</option>
                                    {suppliers.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Year"
                                    value={yearInput}
                                    onChange={e => setYearInput(Number(e.target.value))}
                                />
                            </div>
                            <div className="col-md-3 d-flex gap-2">
                                <button className="btn btn-primary w-100" onClick={handleCreateOrUpdate}>
                                    {editingTenderId ? "Update Tender" : "Create Tender"}
                                </button>
                                {editingTenderId && (
                                    <button className="btn btn-secondary w-100" onClick={handleCancelEdit}>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Number</th>
                                <th>Supplier</th>
                                <th>Year</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenders.map(t => (
                                <tr key={t.id}>
                                    <td>{t.id}</td>
                                    <td>{t.number}</td>
                                    <td>{suppliers.find(s => s.id === t.supplierId)?.name ?? t.supplierId}</td>
                                    <td>{t.year}</td>
                                    <td className="d-flex gap-2">
                                        <button className="btn btn-primary btn-sm" onClick={() => handleEdit(t)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>
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
}
