import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Vehicles from "./pages/Vehicles";
import RepairJobs from "./pages/RepairJobs";
import Inventory from "./pages/Inventory";
import Invoices from "./pages/Invoices";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<ProtectedRoute />}>
     <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/repair-jobs" element={<RepairJobs />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/invoices" element={<Invoices />} />
      </Route>
    </Routes>
  );
}

export default App;