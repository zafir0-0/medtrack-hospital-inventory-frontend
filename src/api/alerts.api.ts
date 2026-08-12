// src/api/alerts.api.ts

export interface ApiLowStock {
    medicine_id: number;
    generic_name: string;
    low_stock_threshold: number;
    total_quantity: string;
}

export interface LowStock {
    id: number;
    name: string;
    lowStockThreshold: number;
    totalQuantity: number;
}

export interface ApiExpiringBatch {
    batch_id: number;
    batch_number: string;
    expiry_date: string;
    quantity_available: number;
    medicine_name: string;
    expiry_threshold_days: number;
    days_left: number;
}

export interface ExpiringBatch {
    id: number;
    batchNumber: string;
    expiryDate: string;
    quantityAvailable: number;
    medicineName: string;
    expiryThresholdDays: number;
    daysLeft: number;
}

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/alerts`;

function mapLowStock(api: ApiLowStock): LowStock {
    return {
        id: api.medicine_id,
        name: api.generic_name,
        lowStockThreshold: api.low_stock_threshold,
        totalQuantity: Number(api.total_quantity),
    };
}

function mapExpiringBatch(api: ApiExpiringBatch): ExpiringBatch {
    return {
        id: api.batch_id,
        batchNumber: api.batch_number,
        expiryDate: api.expiry_date,
        quantityAvailable: api.quantity_available,
        medicineName: api.medicine_name,
        expiryThresholdDays: api.expiry_threshold_days,
        daysLeft: api.days_left,
    };
}

// Fetch low-stock medicines
export const fetchLowStock = async (): Promise<LowStock[]> => {
    const res = await fetch(`${BASE_URL}/low-stock`);
    if (!res.ok) throw new Error("Failed to fetch low-stock medicines");
    const data = (await res.json()) as ApiLowStock[];
    return data.map(mapLowStock);
};

// Fetch expiring batches
export const fetchExpiringBatches = async (): Promise<ExpiringBatch[]> => {
    const res = await fetch(`${BASE_URL}/expiring`);
    if (!res.ok) throw new Error("Failed to fetch expiring batches");
    const data = (await res.json()) as ApiExpiringBatch[];
    return data.map(mapExpiringBatch);
};
