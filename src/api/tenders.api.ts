export interface ApiTender {
    tender_id: number;
    tender_number: string;
    supplier_id: number;
    tender_year: number;
}

export interface Tender {
    id: number;
    number: string;
    supplierId: number;
    year: number;
}


const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/tenders`;

function mapApi(t: ApiTender): Tender {
    return {
        id: t.tender_id,
        number: t.tender_number,
        supplierId: t.supplier_id,
        year: t.tender_year,
    };
}

// ==========================
// Fetch all tenders
// ==========================
export const fetchTenders = async (): Promise<Tender[]> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch tenders");
    const data = (await res.json()) as ApiTender[];
    return data.map(mapApi);
};

// ==========================
// Create new tender
// ==========================
export const createTender = async (payload: { number: string; supplierId: number; year: number; }): Promise<Tender | null> => {
    const body = {
        tender_number: payload.number,
        supplier_id: payload.supplierId,
        tender_year: payload.year,
    };

    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Failed to create tender");

    // Check if response has body
    try {
        const data = await res.json();
        return mapApi(data);
    } catch {
        // No JSON returned, just return null
        return null;
    }
};

// ==========================
// Update tender
// ==========================
export const updateTender = async (id: number, payload: Partial<Tender>): Promise<Tender | null> => {
    // Use proper type instead of any
    const body: Partial<Pick<ApiTender, "tender_number" | "supplier_id" | "tender_year">> = {};

    if (payload.number !== undefined) body.tender_number = payload.number;
    if (payload.supplierId !== undefined) body.supplier_id = payload.supplierId;
    if (payload.year !== undefined) body.tender_year = payload.year;

    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Failed to update tender");

    try {
        const data = await res.json();
        return mapApi(data);
    } catch {
        return null;
    }
};

// ==========================
// Delete tender
// ==========================
export const deleteTender = async (id: number) => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete tender");
};
