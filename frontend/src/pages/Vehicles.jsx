import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import VehicleTable from "../components/vehicles/VehicleTable";

const Vehicles = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await vehicleService.getVehicles();
        setVehicles(response);
      } catch (err) {
        console.error('Failed to fetch vehicles:', err);
        setError(err.response?.data?.error || 'Failed to load vehicles. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleEdit = (id) => {
    navigate(`/vehicles/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      await vehicleService.deleteVehicle(id);
      
      // Optimistically update UI
      setVehicles(prev => prev.filter(vehicle => vehicle._id !== id));
      
    } catch (err) {
      console.error('Failed to delete vehicle:', err);
      alert(err.response?.data?.error || 'Failed to delete vehicle. Please try again.');
    }
  };

  // Conditional Rendering
  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Vehicles</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Vehicles</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

 return (
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Vehicles</h1>
      
      <button
        onClick={() => navigate("/vehicles/new")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
      >
        + Add Vehicle
      </button>
    </div>

    <VehicleTable 
      vehicles={vehicles} 
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  </div>
);
};

export default Vehicles;