import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import customerService from '../services/customerService';
import VehicleForm from '../components/vehicles/VehicleForm'; 

const CreateVehicle = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);

  // Initial form state
  const [formData, setFormData] = useState({
    owner: '',
    brand: '',
    model: '',
    year: '',
    registrationNumber: '',
    fuelType: '',
  });

  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadingCustomers(true);
        const response = await customerService.getCustomers();
        setCustomers(response);
      } catch (err) {
        console.error('Failed to fetch customers:', err);
        setError('Failed to load customers. Please try again.');
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleSubmit = async (data) => {
    try {
      setLoadingSubmit(true);
      setError(null);

      await vehicleService.createVehicle(data);

      navigate('/vehicles', { 
        state: { message: 'Vehicle created successfully!' } 
      });
    } catch (err) {
      console.error('Failed to create vehicle:', err);
      setError(err.response?.data?.error || 'Failed to create vehicle. Please try again.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Loading state while fetching customers
  if (loadingCustomers) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Vehicle</h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex justify-center items-center min-h-[400px]">
          <p className="text-lg text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Vehicle</h1>
        <p className="text-gray-600 mt-1">Fill in the details below</p>
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

export default CreateVehicle;