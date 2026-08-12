// API interfaces and functions for Prescription Items module

export interface ApiPrescriptionItem {
    prescription_item_id: number;
    prescription_id: number;
    medicine_id: number;
    quantity_prescribed: number;
}

export interface PrescriptionItem {
    id: number;
    prescriptionId: number;
    medicineId: number;
    quantity: number;
}

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/prescription-items`;

// map API data
function mapApi(i: ApiPrescriptionItem): PrescriptionItem {
    return {
        id: i.prescription_item_id,
        prescriptionId: i.prescription_id,
        medicineId: i.medicine_id,
        quantity: i.quantity_prescribed,
    };
}

// fetch all prescription items
export const fetchPrescriptionItems = async (): Promise<PrescriptionItem[]> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch prescription items");
    const data = (await res.json()) as ApiPrescriptionItem[];
    return data.map(mapApi);
};

// create a new prescription item
export const createPrescriptionItem = async (item: {
    prescriptionId: number;
    medicineId: number;
    quantity: number;
}): Promise<PrescriptionItem> => {
    const payload = {
        prescription_id: item.prescriptionId,
        medicine_id: item.medicineId,
        quantity_prescribed: item.quantity,
    };

    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to create prescription item");

    const created = (await res.json()) as ApiPrescriptionItem;
    return mapApi(created);
};

export const updatePrescriptionItem = async (
    id: number,
    item: Partial<PrescriptionItem>
): Promise<void> => {
    const payload = {
        prescription_id: item.prescriptionId,
        medicine_id: item.medicineId,
        quantity_prescribed: item.quantity,
    };

    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update prescription item");
};

export const deletePrescriptionItem = async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete prescription item");
};
