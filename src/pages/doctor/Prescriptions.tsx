import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import Sidebar from "../../components/Sidebar.tsx";
import { useAppSelector } from "../../store/hooks";

import {
    fetchPrescriptionsByDoctor,
    createPrescription,
} from "../../api/prescriptions.api";
import {
    fetchPrescriptionItems,
    createPrescriptionItem,
    deletePrescriptionItem,
} from "../../api/prescriptionItems.api";
import { fetchPatients } from "../../api/patients.api";
import { fetchMedicines } from "../../api/medicines.api";

import type { Prescription } from "../../api/prescriptions.api";
import type { PrescriptionItem } from "../../api/prescriptionItems.api";
import type { Patient } from "../../api/patients.api";
import type { Medicine } from "../../api/medicines.api";

const PrescriptionsPage = () => {
    const user = useAppSelector((state) => state.auth.user);

    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [items, setItems] = useState<PrescriptionItem[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [medicines, setMedicines] = useState<Medicine[]>([]);

    const [patientId, setPatientId] = useState<number>(0);
    const [selectedMedicineId, setSelectedMedicineId] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);

    const [pendingItems, setPendingItems] = useState<
        { medicineId: number; quantity: number; id?: number; prescriptionId?: number }[]
    >([]);

    const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

    const loadData = useCallback(async () => {
        if (!user) return;

        const [prescriptionsData, itemsData, patientsData, medicinesData] =
            await Promise.all([
                fetchPrescriptionsByDoctor(user.id),
                fetchPrescriptionItems(),
                fetchPatients(),
                fetchMedicines(),
            ]);

        setPrescriptions(prescriptionsData);
        setItems(itemsData);
        setPatients(patientsData);
        setMedicines(medicinesData);
    }, [user]);

    useEffect(() => {
        (async () => {
            try {
                await loadData();
            } catch (err) {
                console.error(err);
            }
        })();
    }, [loadData]);

    const handleAddOrUpdateItem = () => {
        if (!selectedMedicineId || quantity <= 0) return;

        if (editingItemIndex !== null) {
            // Update pending item
            setPendingItems((prev) => {
                const updated = [...prev];
                updated[editingItemIndex] = {
                    ...updated[editingItemIndex],
                    medicineId: selectedMedicineId,
                    quantity,
                };
                return updated;
            });
            setEditingItemIndex(null);
        } else {
            // Add new item
            setPendingItems((prev) => [...prev, { medicineId: selectedMedicineId, quantity }]);
        }

        setSelectedMedicineId(0);
        setQuantity(1);
    };

    const handleEditItem = (index: number) => {
        const item = pendingItems[index];
        setSelectedMedicineId(item.medicineId);
        setQuantity(item.quantity);
        setEditingItemIndex(index);
    };

    const handleDeleteItem = async (item: { id?: number }, index: number) => {
        const confirm = await Swal.fire({
            title: "Delete Item?",
            text: "This item will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });
        if (!confirm.isConfirmed) return;

        if (item.id) {
            // Persisted item, delete from backend
            try {
                await deletePrescriptionItem(item.id);
                await loadData();
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Failed to delete item", "error");
            }
        } else {
            // Pending item, remove locally
            setPendingItems((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleSavePrescription = async () => {
        if (!patientId || pendingItems.length === 0 || !user) return;

        const result = await Swal.fire({
            title: "Confirm Prescription",
            html: `You are about to save a prescription for <b>${
                patients.find((p) => p.id === patientId)?.name
            }</b> with ${pendingItems.length} medicines.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, save it!",
        });

        if (result.isConfirmed) {
            try {
                const today = new Date().toISOString().split("T")[0];
                const prescription = await createPrescription({
                    patientId,
                    doctorId: user.id,
                    date: today,
                });

                await Promise.all(
                    pendingItems.map((item) =>
                        createPrescriptionItem({
                            prescriptionId: prescription.id,
                            medicineId: item.medicineId,
                            quantity: item.quantity,
                        })
                    )
                );

                setPatientId(0);
                setPendingItems([]);
                await loadData();

                Swal.fire({
                    title: "Saved!",
                    text: "Prescription saved successfully.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (err) {
                console.error(err);
                Swal.fire({
                    title: "Error",
                    text: "Failed to save prescription.",
                    icon: "error",
                });
            }
        }
    };

    const getPatientName = (id: number) => patients.find((p) => p.id === id)?.name || "Unknown";
    const getMedicineName = (id: number) => medicines.find((m) => m.id === id)?.genericName || "Unknown";
    const getItemsForPrescription = (prescriptionId: number) =>
        items.filter((i) => i.prescriptionId === prescriptionId);

    return (
        <div className="container-fluid vh-100 d-flex flex-column p-0">
            <div className="row flex-grow-1">
                <Sidebar />
                <div className="col-10 p-4 bg-light">
                    <h2>My Prescriptions</h2>

                    <div className="card mb-4">
                        <div className="card-body">
                            <h5>Create Prescription</h5>

                            <select
                                className="form-control mb-2"
                                value={patientId}
                                onChange={(e) => setPatientId(Number(e.target.value))}
                            >
                                <option value={0}>Select Patient</option>
                                {patients.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>

                            <div className="d-flex gap-2 mb-2">
                                <select
                                    className="form-control"
                                    value={selectedMedicineId}
                                    onChange={(e) => setSelectedMedicineId(Number(e.target.value))}
                                >
                                    <option value={0}>Select Medicine</option>
                                    {medicines.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.genericName}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                />

                                <button className="btn btn-primary" onClick={handleAddOrUpdateItem}>
                                    {editingItemIndex !== null ? (
                                        <i className="bi bi-pencil-square"></i>
                                    ) : "Add Medicine"}
                                </button>
                                {editingItemIndex !== null && (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setEditingItemIndex(null);
                                            setSelectedMedicineId(0);
                                            setQuantity(1);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>

                            {pendingItems.length > 0 && (
                                <ul className="mb-2">
                                    {pendingItems.map((item, idx) => (
                                        <li key={idx} className="d-flex gap-2 align-items-center">
                                            {getMedicineName(item.medicineId)} — {item.quantity}
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handleEditItem(idx)}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteItem(item, idx)}
                                            >
                                                🗑️
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <button className="btn btn-success" onClick={handleSavePrescription}>
                                Save Prescription
                            </button>
                        </div>
                    </div>

                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Patient</th>
                                <th>Date</th>
                                <th>Medicines</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescriptions.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{getPatientName(p.patientId)}</td>
                                    <td>{p.date}</td>
                                    <td>
                                        <ul className="mb-0">
                                            {getItemsForPrescription(p.id).map((i, idx) => (
                                                <li key={i.id} className="d-flex gap-2 align-items-center">
                                                    {getMedicineName(i.medicineId)} — {i.quantity}
                                                    {/* <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => {
                                                            setSelectedMedicineId(i.medicineId);
                                                            setQuantity(i.quantity);
                                                            setEditingItemIndex(idx);
                                                            setPendingItems([{ ...i }]); // Load item into pending
                                                        }}
                                                    >
                                                        ✏️
                                                    </button> */}
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDeleteItem(i, idx)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {prescriptions.length === 0 && (
                        <div className="alert alert-info">No prescriptions found</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrescriptionsPage;
