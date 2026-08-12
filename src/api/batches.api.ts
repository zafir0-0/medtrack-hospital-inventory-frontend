const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/batches`;

export interface ApiBatch {
    batch_id: number;
    medicine_id: number;
    tender_id: number;
    batch_number: string;
    expiry_date: string;
    quantity_available: number;
}

export interface Batch {
    id: number;
    medicineId: number;
    tenderId: number;
    batchNumber: string;
    expiryDate: string;
    quantity: number;
}

function mapApiBatch(d: ApiBatch): Batch {
    return {
        id: d.batch_id,
        medicineId: d.medicine_id,
        tenderId: d.tender_id,
        batchNumber: d.batch_number,
        expiryDate: d.expiry_date,
        quantity: d.quantity_available,
    };
}

export const fetchBatches = async (): Promise<Batch[]> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch batches");
    const data = (await res.json()) as ApiBatch[];
    return data.map(mapApiBatch);
};

export const createBatch = async (batch: { medicineId: number; tenderId: number; batchNumber: string; expiryDate: string; quantity: number; }): Promise<Batch> => {
    const payload = {
        medicine_id: batch.medicineId,
        tender_id: batch.tenderId,
        batch_number: batch.batchNumber,
        expiry_date: batch.expiryDate,
        quantity_available: batch.quantity,
    };
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create batch");
    const created = (await res.json()) as ApiBatch;
    return mapApiBatch(created);
};

export const updateBatch = async (id: number, batch: Partial<Batch>): Promise<Batch> => {
    const payload: Partial<ApiBatch> = {};
    if (batch.medicineId !== undefined) payload.medicine_id = batch.medicineId;
    if (batch.tenderId !== undefined) payload.tender_id = batch.tenderId;
    if (batch.batchNumber !== undefined) payload.batch_number = batch.batchNumber;
    if (batch.expiryDate !== undefined) payload.expiry_date = batch.expiryDate;
    if (batch.quantity !== undefined) payload.quantity_available = batch.quantity;

    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update batch");
    const updated = (await res.json()) as ApiBatch;
    return mapApiBatch(updated);
};

export const deleteBatch = async (id: number) => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete batch");
};