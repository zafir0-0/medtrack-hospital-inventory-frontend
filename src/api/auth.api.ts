import type { User, ApiUser } from "../auth/types";

function normalizeRole(role: string): User["role"] {
    if (!role) return role as User["role"];
    const r = role.toLowerCase();
    if (r === "admin") return "Admin";
    if (r === "pharmacist") return "Pharmacist";
    if (r === "doctor") return "Doctor";
    return role as User["role"];
}

export async function loginUser(email: string, password: string): Promise<User> {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        let body: Record<string, unknown> | null = null;
        try {
            body = (await res.json()) as Record<string, unknown>;
        } catch (err) {
            // ignore parse errors
            void err;
        }
        const msg = (body && ((body["message"] as string) || (body["error"] as string))) || `Login failed (${res.status})`;
        throw new Error(msg);
    }

    const data = (await res.json()) as ApiUser;

    const user: User = {
        id: data.user_id,
        fullName: data.full_name,
        email: data.email,
        role: normalizeRole(data.role),
        isActive: data.is_active,
    };

    return user;
}
