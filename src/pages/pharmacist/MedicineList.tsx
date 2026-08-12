import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Sidebar from "../../components/Sidebar.tsx";
import { fetchMedicines, createMedicine, updateMedicine, deleteMedicine } from "../../api/medicines.api";
import type { Medicine } from "../../api/medicines.api";

const MedicineList = () => {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [genericName, setGenericName] = useState("");
    const [strength, setStrength] = useState("");
    const [dosageForm, setDosageForm] = useState("");
    const [unit, setUnit] = useState("");
    const [low_stock_threshold, setLowStockThreshold] = useState<number>(0);
    const [expiry_threshold_days, setExpiryThresholdDays] = useState<number>(0);
    const [editingMedicineId, setEditingMedicineId] = useState<number | null>(null);

    // Load medicines safely
    useEffect(() => {
        const loadMedicines = async () => {
            try {
                const data = await fetchMedicines();
                setMedicines(data);
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Failed to load medicines", "error");
            }
        };
        loadMedicines();
    }, []);

    // Create or Update medicine
    const handleCreateOrUpdate = async () => {
        if (!genericName || !strength || !dosageForm || !unit) {
            Swal.fire("Warning", "Please fill all required fields", "warning");
            return;
        }

        try {
            if (editingMedicineId) {
                await updateMedicine(editingMedicineId, { genericName, strength, dosageForm, unit, low_stock_threshold, expiry_threshold_days });
                Swal.fire("Success", "Medicine updated successfully", "success");
            } else {
                await createMedicine({ genericName, strength, dosageForm, unit, low_stock_threshold, expiry_threshold_days });
                Swal.fire("Success", "Medicine added successfully", "success");
            }

            // Reset form
            setGenericName(""); setStrength(""); setDosageForm(""); setUnit("");
            setLowStockThreshold(0); setExpiryThresholdDays(0);
            setEditingMedicineId(null);

            const data = await fetchMedicines();
            setMedicines(data);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", editingMedicineId ? "Failed to update medicine" : "Failed to create medicine", "error");
        }
    };

    // Edit medicine
    const handleEdit = (medicine: Medicine) => {
        setEditingMedicineId(medicine.id);
        setGenericName(medicine.genericName);
        setStrength(medicine.strength);
        setDosageForm(medicine.dosageForm);
        setUnit(medicine.unit);
        setLowStockThreshold(medicine.low_stock_threshold);
        setExpiryThresholdDays(medicine.expiry_threshold_days);
    };

    // Cancel edit
    const handleCancelEdit = () => {
        setEditingMedicineId(null);
        setGenericName(""); setStrength(""); setDosageForm(""); setUnit("");
        setLowStockThreshold(0); setExpiryThresholdDays(0);
    };

    // Delete medicine
    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This medicine will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                await deleteMedicine(id);
                Swal.fire("Deleted!", "Medicine has been deleted.", "success");

                const data = await fetchMedicines();
                setMedicines(data);
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
                    <h2>Medicines</h2>

                    <div className="mb-3">
                        <input className="form-control mb-2" placeholder="Generic Name" value={genericName} onChange={e => setGenericName(e.target.value)} />
                        <input className="form-control mb-2" placeholder="Strength" value={strength} onChange={e => setStrength(e.target.value)} />
                        <input className="form-control mb-2" placeholder="Dosage Form" value={dosageForm} onChange={e => setDosageForm(e.target.value)} />
                        <input className="form-control mb-2" placeholder="Unit" value={unit} onChange={e => setUnit(e.target.value)} />
                        <input className="form-control mb-2" placeholder="Low Stock Threshold" type="number" value={low_stock_threshold} onChange={e => setLowStockThreshold(Number(e.target.value))} />
                        <input className="form-control mb-2" placeholder="Expiry Threshold Days" type="number" value={expiry_threshold_days} onChange={e => setExpiryThresholdDays(Number(e.target.value))} />

                        <div className="d-flex gap-2">
                            <button className="btn btn-success" onClick={handleCreateOrUpdate}>
                                {editingMedicineId ? "Update Medicine" : "Add Medicine"}
                            </button>
                            {editingMedicineId && (
                                <button className="btn btn-secondary" onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Generic Name</th>
                                <th>Strength</th>
                                <th>Dosage Form</th>
                                <th>Unit</th>
                                <th>Low Stock Threshold</th>
                                <th>Expiry Threshold Days</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.map(m => (
                                <tr key={m.id}>
                                    <td>{m.genericName}</td>
                                    <td>{m.strength}</td>
                                    <td>{m.dosageForm}</td>
                                    <td>{m.unit}</td>
                                    <td>{m.low_stock_threshold}</td>
                                    <td>{m.expiry_threshold_days}</td>
                                    <td className="d-flex gap-2">
                                        <button className="btn btn-primary btn-sm" onClick={() => handleEdit(m)}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)}>Delete</button>
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

export default MedicineList;
