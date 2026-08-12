import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.tsx'
import AdminDashboard from './pages/admin/AdminDashboard.tsx'
import UserList from './pages/admin/UserList.tsx'
import SupplierList from './pages/admin/SupplierList.tsx'
import TenderList from './pages/admin/TenderList.tsx'
import PharmacistDashboard from './pages/pharmacist/PharmacistDashboard.tsx'
import MedicineList from './pages/pharmacist/MedicineList.tsx'
import BatchList from './pages/pharmacist/BatchList.tsx'
import AlertsPage from './pages/pharmacist/Alerts.tsx'
import DoctorDashboard from './pages/doctor/DoctorDashboard.tsx'
import PrescriptionsPage from './pages/doctor/Prescriptions.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Navigate to="/login" replace />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserList />} />
      <Route path="/admin/suppliers" element={<SupplierList />} />
      <Route path="/admin/tenders" element={<TenderList />} />
      <Route path="/pharmacist/dashboard" element={<PharmacistDashboard />} />
      <Route path="/pharmacist/medicines" element={<MedicineList />} />
      <Route path="/pharmacist/batches" element={<BatchList />} />
      <Route path="/pharmacist/alerts" element={<AlertsPage />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/prescriptions" element={<PrescriptionsPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
