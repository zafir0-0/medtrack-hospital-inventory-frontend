export interface ApiSupplier {
    supplier_id: number;
    supplier_name: string;
    contact_number?: string;
    address?: string;
}

export interface Supplier {
    id: number;
    name: string;
    contact?: string;
    address?: string;
}

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/suppliers`;

function mapApi(s: ApiSupplier): Supplier {
    return {
        id: s.supplier_id,
        name: s.supplier_name,
        contact: s.contact_number ?? "",
        address: s.address ?? "",
    };
}

export const fetchSuppliers = async (): Promise<Supplier[]> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch suppliers");
    const data = (await res.json()) as ApiSupplier[];
    return data.map(mapApi);
};

export const createSupplier = async (supplier: { name: string; contact?: string; address?: string; }): Promise<Supplier> => {
    const payload = {
        supplier_name: supplier.name,
        contact_number: supplier.contact ?? "",
        address: supplier.address ?? "",
    };
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create supplier");
    const created = (await res.json()) as ApiSupplier;
    return mapApi(created);
};

// ==========================
// Update supplier (returns void, backend returns no body)
// ==========================
export const updateSupplier = async (id: number, supplier: Partial<Supplier>): Promise<void> => {
    const payload = {
        supplier_name: supplier.name,
        contact_number: supplier.contact ?? "",
        address: supplier.address ?? "",
    };
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update supplier");
};

// ==========================
// Delete supplier
// ==========================
export const deleteSupplier = async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete supplier");
};
