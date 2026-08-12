export interface ApiUser {
    user_id: number;
    full_name: string;
    email: string;
    password_hash: string;
    role: "admin" | "pharmacist" | "doctor" | string;
    is_active: boolean;
}

export interface User {
    id: number;
    fullName: string;
    email: string;
    role: "Admin" | "Pharmacist" | "Doctor" | string;
    isActive: boolean;
}