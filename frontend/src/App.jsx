import './app.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from './components/Layout/Layout';

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CreateCustomer from "./pages/CreateCustomer";
import EditCustomer from "./pages/EditCustomer";

import Vehicles from "./pages/Vehicles";
import CreateVehicle from "./pages/CreateVehicle";     // ← Add this
import EditVehicle from "./pages/EditVehicle";         // ← Add this

import RepairJobs from "./pages/RepairJobs";
import CreateRepairJob from "./pages/CreateRepairJob";
import EditRepairJob from "./pages/EditRepairJob";

import Inventory from "./pages/Inventory";
import CreateInventoryItem from "./pages/CreateInventoryItem";
import EditInventoryItem from "./pages/EditInventoryItem";

import Invoices from "./pages/Invoices";
import CreateInvoice from "./pages/CreateInvoice";
import EditInvoice from "./pages/EditInvoice";

import InvoiceDetails from './pages/InvoiceDetails';
import PrintInvoice from './pages/printInvoice';

import ProtectedRoute from "./routes/ProtectedRoute";
// import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
       <Route element={<ProtectedRoute />}>
        {/* Use Layout directly as the parent route */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/new" element={<CreateCustomer />} />
          <Route path="/customers/edit/:id" element={<EditCustomer />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/new" element={<CreateVehicle />} />
          <Route path="/vehicles/edit/:id" element={<EditVehicle />} />
          <Route path="/repair-jobs" element={<RepairJobs />} />
          <Route path="/repair-jobs/new" element={<CreateRepairJob />} />
          <Route path="/repair-jobs/edit/:id" element={<EditRepairJob />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/new" element={<CreateInventoryItem />} />
          <Route path="/inventory/edit/:id" element={<EditInventoryItem />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/new" element={<CreateInvoice />} />
          <Route path="/invoices/edit/:id" element={<EditInvoice />} />
          <Route path="/invoices/:id" element={<InvoiceDetails />}/>
          <Route path="invoices/print/:id" element={<PrintInvoice />} />
        </Route>
      </Route>
    </Routes>
    
           <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;