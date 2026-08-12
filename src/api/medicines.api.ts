const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/medicines`;

export interface ApiMedicine {
    medicine_id: number;
    generic_name: string;
    strength: string;
    dosage_form: string;
    unit: string;
    low_stock_threshold: number;
    expiry_threshold_days: number;
}

export interface Medicine {
    id: number;
    genericName: string;
    strength: string;
    dosageForm: string;
    unit: string;
    low_stock_threshold: number;
    expiry_threshold_days: number;
}

function mapApiMedicine(d: ApiMedicine): Medicine {
    return {
        id: d.medicine_id,
        genericName: d.generic_name,
        strength: d.strength,
        dosageForm: d.dosage_form,
        unit: d.unit,
        low_stock_threshold: d.low_stock_threshold,
        expiry_threshold_days: d.expiry_threshold_days,
    };
}

export const fetchMedicines = async (): Promise<Medicine[]> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch medicines");
    const data = (await res.json()) as ApiMedicine[];
    return data.map(mapApiMedicine);
};

export const createMedicine = async (medicine: { genericName: string; strength: string; dosageForm: string; unit: string; low_stock_threshold: number, expiry_threshold_days: number }): Promise<Medicine> => {
    const payload = {
        generic_name: medicine.genericName,
        strength: medicine.strength,
        dosage_form: medicine.dosageForm,
        unit: medicine.unit,
        low_stock_threshold: medicine.low_stock_threshold,
        expiry_threshold_days: medicine.expiry_threshold_days,
    };
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create medicine");
    const created = (await res.json()) as ApiMedicine;
    return mapApiMedicine(created);
};

export const updateMedicine = async (id: number, medicine: Partial<Medicine>): Promise<Medicine> => {
    const payload: Partial<ApiMedicine> = {};
    if (medicine.genericName !== undefined) payload.generic_name = medicine.genericName;
    if (medicine.strength !== undefined) payload.strength = medicine.strength;
    if (medicine.dosageForm !== undefined) payload.dosage_form = medicine.dosageForm;
    if (medicine.unit !== undefined) payload.unit = medicine.unit;
    if (medicine.low_stock_threshold !== undefined) payload.low_stock_threshold = medicine.low_stock_threshold;
    if (medicine.expiry_threshold_days !== undefined) payload.expiry_threshold_days = medicine.expiry_threshold_days;

    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update medicine");
    const updated = (await res.json()) as ApiMedicine;
    return mapApiMedicine(updated);
};

export const deleteMedicine = async (id: number) => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete medicine");
};