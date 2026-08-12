// API interfaces and functions for Patients module

export interface ApiPatient {
    patient_id: number;
    patient_name: string;
    age: number;
    gender: string;
}

export interface Patient {
    id: number;
    name: string;
    age: number;
    gender: string;
}

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/patients`;

// map API data
function mapApi(p: ApiPatient): Patient {
    return {
        id: p.patient_id,
        name: p.patient_name,
        age: p.age,
        gender: p.gender,
    };
}

// fetch all patients
export const fetchPatients = async (): Promise<Patient[]> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch patients");
    const data = (await res.json()) as ApiPatient[];
    return data.map(mapApi);
};
