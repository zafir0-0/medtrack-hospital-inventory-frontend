// ==========================
// Users API for Redux-managed app
// ==========================

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/users`;

// ==========================
// Local API user interface
// ==========================
interface ApiUser {
    user_id: number;
    full_name: string;
    email: string;
    role: string;
    is_active: boolean;
}

// ==========================
// Frontend-friendly User interface
// ==========================
export interface User {
    id: number;
    fullName: string;
    email: string;
    role: string;
    isActive: boolean;
}

// ==========================
// Map API response → frontend model
// ==========================
const mapApiUser = (d: ApiUser): User => ({
    id: d.user_id,
    fullName: d.full_name,
    email: d.email,
    role: d.role ? d.role.charAt(0).toUpperCase() + d.role.slice(1) : "",
    isActive: d.is_active,
});

// ==========================
// Fetch all users
// ==========================
export const fetchUsers = async (): Promise<User[]> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch users");
    const data = (await res.json()) as ApiUser[];
    return data.map(mapApiUser);
};

// ==========================
// Create new user
// ==========================
export const createUser = async (user: {
    email: string;
    fullName: string;
    role: string;
    password?: string;
}): Promise<User> => {
    const payload = {
        full_name: user.fullName,
        email: user.email,
        password_hash: user.password ?? "12345678",
        role: user.role.toLowerCase(),
    };

    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to create user");
    const created = (await res.json()) as ApiUser;
    return mapApiUser(created);
};

// ==========================
// Update user
// ==========================
export const updateUser = async (id: number, user: Partial<User>): Promise<void> => {
    const payload = {
        full_name: user.fullName,
        email: user.email,
        role: user.role?.toLowerCase(),
    };

    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update user");
    // Backend returns 200 but no body → just return void
};

// ==========================
// Delete user
// ==========================
export const deleteUser = async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete user");
};
