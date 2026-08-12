// API interfaces and functions for Prescriptions (Doctor module)

// ==========================
// Raw API response interface
// ==========================
export interface ApiPrescription {
    prescription_id: number;
    patient_id: number;
    doctor_id: number;
    prescription_date: string;
}

// ==========================
// Frontend-friendly interface
// ==========================
export interface Prescription {
    id: number;
    patientId: number;
    doctorId: number;
    date: string;
}

// ==========================
// API base URL
// ==========================
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/prescriptions`;

// ==========================
// Map API → Frontend model
// ==========================
export const mapApi = (p: ApiPrescription): Prescription => ({
    id: p.prescription_id,
    patientId: p.patient_id,
    doctorId: p.doctor_id,
    date: p.prescription_date,
});

// ==========================
// Fetch all prescriptions
// ==========================
export const fetchPrescriptions = async (): Promise<Prescription[]> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch prescriptions");
    const data = (await res.json()) as ApiPrescription[];
    return data.map(mapApi);
};

// ==========================
// Fetch prescriptions by doctor ID
// ==========================
export const fetchPrescriptionsByDoctor = async (doctorId: number): Promise<Prescription[]> => {
    const res = await fetch(`${BASE_URL}/doctor/${doctorId}`);
    if (!res.ok) throw new Error("Failed to fetch doctor's prescriptions");
    const data = (await res.json()) as ApiPrescription[];
    return data.map(mapApi);
};

// ==========================
// Create new prescription
// ==========================
export const createPrescription = async (data: {
    patientId: number;
    doctorId: number;
    date: string;
}): Promise<Prescription> => {
    const payload = {
        patient_id: data.patientId,
        doctor_id: data.doctorId,
        prescription_date: data.date,
    };

    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to create prescription");
    const created = (await res.json()) as ApiPrescription;
    return mapApi(created);
};

// ==========================
// Delete prescription
// ==========================
export const deletePrescription = async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete prescription");
};
