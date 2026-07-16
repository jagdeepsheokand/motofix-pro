import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import customerService from '../services/customerService';
import VehicleForm from '../components/vehicles/VehicleForm';

const EditVehicle = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get vehicle ID from URL

  const [customers, setCustomers] = useState([]);
  

  const [loading, setLoading] = useState(true);        // Combined loading for initial data
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    owner: '',
    brand: '',
    model: '',
    year: '',
    registrationNumber: '',
    fuelType: '',
  });

  // Fetch both customers and vehicle data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch customers and vehicle in parallel
        const [customersResponse, vehicleResponse] = await Promise.all([
          customerService.getCustomers(),
          vehicleService.getVehicleById(id)
        ]);

        setCustomers(customersResponse);

        // Populate form with existing vehicle data
        const veh = vehicleResponse; // Handle both .data and direct response
        

        setFormData({
          owner: veh.owner?._id || veh.owner || '',
          brand: veh.brand || '',
          model: veh.model || '',
          year: veh.year || '',
          registrationNumber: veh.registrationNumber || '',
          fuelType: veh.fuelType || '',
        });
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err.response?.data?.error || 'Failed to load vehicle details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      setLoadingSubmit(true);
      setError(null);

      await vehicleService.updateVehicle(id, data);

      navigate('/vehicles', { 
        state: { message: 'Vehicle updated successfully!' } 
      });
    } catch (err) {
      console.error('Failed to update vehicle:', err);
      setError(err.response?.data?.error || 'Failed to update vehicle. Please try again.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Vehicle</h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex justify-center items-center min-h-[400px]">
          <p className="text-lg text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Vehicle</h1>
        <p className="text-gray-600 mt-1">Update the vehicle information</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <VehicleForm
          formData={formData}
          setFormData={setFormData}
          customers={customers}
          onSubmit={handleSubmit}
          loading={loadingSubmit}
        />
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/vehicles')}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium"
        >
          ← Back to Vehicles
        </button>
      </div>
    </div>
  );
};

export default EditVehicle;