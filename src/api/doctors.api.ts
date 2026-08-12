// API interfaces and functions for Doctors module

export interface ApiUser {
    user_id: number;
    full_name: string;
    role: string;
}

export interface Doctor {
    id: number;
    name: string;
}

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/users`;

// map API data
function mapApi(u: ApiUser): Doctor {
    return {
        id: u.user_id,
        name: u.full_name,
    };
}

// fetch doctors only
export const fetchDoctors = async (): Promise<Doctor[]> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch users");

    const data = (await res.json()) as ApiUser[];

    return data
        .filter(u => u.role === "doctor")
        .map(mapApi);
};
