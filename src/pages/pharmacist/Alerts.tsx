import { useEffect, useState } from "react";
import { fetchLowStock, fetchExpiringBatches } from "../../api/alerts.api";
import type { LowStock, ExpiringBatch } from "../../api/alerts.api";
import Sidebar from "../../components/Sidebar.tsx";

const AlertsPage = () => {
    const [lowStock, setLowStock] = useState<LowStock[]>([]);
    const [expiring, setExpiring] = useState<ExpiringBatch[]>([]);

    useEffect(() => {
        const loadAlerts = async () => {
            const [lowStockData, expiringData] = await Promise.all([
                fetchLowStock(),
                fetchExpiringBatches()
            ]);
            setLowStock(lowStockData);
            setExpiring(expiringData);
        };

        loadAlerts().catch(console.error);
    }, []);

    return (
        <div className="container-fluid vh-100 d-flex flex-column p-0">
            <div className="row flex-grow-1">
                {/* Sidebar no longer needs role prop */}
                <Sidebar />

                <div className="col-10 p-4 bg-light">
                    <h2 className="mb-4">Alerts Dashboard</h2>

                    {/* Low Stock Medicines */}
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header bg-warning text-dark">
                            <h5 className="mb-0">Low Stock Medicines</h5>
                        </div>
                        <div className="card-body p-0">
                            <table className="table table-striped mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Medicine</th>
                                        <th>Total Quantity</th>
                                        <th>Low Stock Threshold</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowStock.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center text-muted">
                                                All medicines are above threshold
                                            </td>
                                        </tr>
                                    ) : (
                                        lowStock.map(m => (
                                            <tr key={m.id}>
                                                <td>{m.name}</td>
                                                <td>{m.totalQuantity}</td>
                                                <td>{m.lowStockThreshold}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Expiring Batches */}
                    <div className="card shadow-sm">
                        <div className="card-header bg-danger text-white">
                            <h5 className="mb-0">Expiring Batches</h5>
                        </div>
                        <div className="card-body p-0">
                            <table className="table table-striped mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Medicine</th>
                                        <th>Batch Number</th>
                                        <th>Expiry Date</th>
                                        <th>Quantity</th>
                                        <th>Days Left</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expiring.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center text-muted">
                                                No batches expiring soon
                                            </td>
                                        </tr>
                                    ) : (
                                        expiring.map(b => (
                                            <tr key={b.id}>
                                                <td>{b.medicineName}</td>
                                                <td>{b.batchNumber}</td>
                                                <td>{b.expiryDate}</td>
                                                <td>{b.quantityAvailable}</td>
                                                <td>{b.daysLeft}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertsPage;
