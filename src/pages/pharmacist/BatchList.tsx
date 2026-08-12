import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Sidebar from "../../components/Sidebar.tsx";
import { fetchBatches, createBatch, updateBatch, deleteBatch } from "../../api/batches.api";
import { fetchMedicines } from "../../api/medicines.api";
import { fetchTenders } from "../../api/tenders.api";
import type { Batch } from "../../api/batches.api";
import type { Medicine } from "../../api/medicines.api";
import type { Tender } from "../../api/tenders.api";

const BatchList = () => {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [tenders, setTenders] = useState<Tender[]>([]);
    const [medicineId, setMedicineId] = useState<number>(0);
    const [tenderId, setTenderId] = useState<number>(0);
    const [batchNumber, setBatchNumber] = useState("");
    const [quantity, setQuantity] = useState<number>(0);
    const today = new Date().toISOString().split("T")[0];
    const [expiryDate, setExpiryDate] = useState<string>(today);
    const [editingBatchId, setEditingBatchId] = useState<number | null>(null);

    // Load all data
    useEffect(() => {
        const loadData = async () => {
            try {
                const [bData, mData, tData] = await Promise.all([
                    fetchBatches(),
                    fetchMedicines(),
                    fetchTenders(),
                ]);
                setBatches(bData);
                setMedicines(mData);
                setTenders(tData);

                setMedicineId(prev => prev || (mData[0]?.id ?? 0));
                setTenderId(prev => prev || (tData[0]?.id ?? 0));
            } catch (err) {
                Swal.fire("Error", "Failed to load batches, medicines, or tenders", "error");
                console.error(err);
            }
        };

        loadData();
    }, []);

    // Create or update batch
    const handleCreateOrUpdate = async () => {
        if (medicineId === 0 || tenderId === 0 || !batchNumber || quantity <= 0) {
            Swal.fire("Warning", "Please fill all fields correctly", "warning");
            return;
        }

        try {
            if (editingBatchId) {
                await updateBatch(editingBatchId, { medicineId, tenderId, batchNumber, quantity, expiryDate });
                Swal.fire("Success", "Batch updated successfully", "success");
            } else {
                await createBatch({ medicineId, tenderId, batchNumber, quantity, expiryDate });
                Swal.fire("Success", "Batch added successfully", "success");
            }

            // Reset form
            setBatchNumber("");
            setQuantity(0);
            setExpiryDate(today);
            setEditingBatchId(null);

            const bData = await fetchBatches();
            setBatches(bData);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", editingBatchId ? "Failed to update batch" : "Failed to create batch", "error");
        }
    };

    // Edit batch
    const handleEdit = (batch: Batch) => {
        setEditingBatchId(batch.id);
        setMedicineId(batch.medicineId);
        setTenderId(batch.tenderId);
        setBatchNumber(batch.batchNumber);
        setQuantity(batch.quantity);
        setExpiryDate(batch.expiryDate);
    };

    // Cancel edit
    const handleCancelEdit = () => {
        setEditingBatchId(null);
        setBatchNumber("");
        setQuantity(0);
        setExpiryDate(today);
        setMedicineId(medicines[0]?.id ?? 0);
        setTenderId(tenders[0]?.id ?? 0);
    };

    // Delete batch
    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This batch will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                await deleteBatch(id);
                Swal.fire("Deleted!", "Batch has been deleted.", "success");

                const bData = await fetchBatches();
                setBatches(bData);
            } catch (err) {
                Swal.fire("Error", (err as Error).message, "error");
            }
        }
    };

    const getMedicineName = (id: number) => medicines.find(m => m.id === id)?.genericName || "Unknown";
    const getTenderNumber = (id: number) => tenders.find(t => t.id === id)?.number || "Unknown";

    return (
        <div className="container-fluid vh-100 d-flex flex-column p-0">
            <div className="row flex-grow-1">
                <Sidebar />
                <div className="col-10 p-4 bg-light">
                    <h2>Batches</h2>
                    <div className="mb-3">
                        <select className="form-select mb-2" value={medicineId} onChange={e => setMedicineId(Number(e.target.value))}>
                            <option value={0}>Select Medicine</option>
                            {medicines.map(m => (
                                <option key={m.id} value={m.id}>{m.genericName} {m.strength} ({m.dosageForm})</option>
                            ))}
                        </select>

                        <select className="form-select mb-2" value={tenderId} onChange={e => setTenderId(Number(e.target.value))}>
                            <option value={0}>Select Tender</option>
                            {tenders.map(t => (
                                <option key={t.id} value={t.id}>{t.number} ({t.year})</option>
                            ))}
                        </select>

                        <input className="form-control mb-2" placeholder="Batch Number" value={batchNumber} onChange={e => setBatchNumber(e.target.value)} />
                        <input type="number" className="form-control mb-2" placeholder="Quantity" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
                        <input type="date" className="form-control mb-2" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />

                        <div className="d-flex gap-2">
                            <button className="btn btn-success" onClick={handleCreateOrUpdate}>
                                {editingBatchId ? "Update Batch" : "Add Batch"}
                            </button>
                            {editingBatchId && (
                                <button className="btn btn-secondary" onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Medicine</th>
                                <th>Tender</th>
                                <th>Batch Number</th>
                                <th>Quantity</th>
                                <th>Expiry Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {batches.map(b => (
                                <tr key={b.id}>
                                    <td>{getMedicineName(b.medicineId)}</td>
                                    <td>{getTenderNumber(b.tenderId)}</td>
                                    <td>{b.batchNumber}</td>
                                    <td>{b.quantity}</td>
                                    <td>{b.expiryDate}</td>
                                    <td className="d-flex gap-2">
                                        <button className="btn btn-primary btn-sm" onClick={() => handleEdit(b)}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>Delete</button>
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

export default BatchList;
