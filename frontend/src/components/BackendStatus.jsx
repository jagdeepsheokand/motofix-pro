import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BackendStatus = () => {
    const [backendStatus, setBackendStatus] = useState('Checking...');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/')
            .then((response) => {
                setBackendStatus(response.data.status || 'success');
                setMessage(response.data.message || 'Backend connected successfully!');
                setError(null);
            })
            .catch((err) => {
                console.error('Axios Error:', err);
                setBackendStatus('error');
                setError('Failed to connect to backend. Make sure backend is running on port 3000.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '600px' }}>
            <h1>Frontend ↔ Backend Connection Test</h1>
            
            <div style={{ margin: '20px 0' }}>
                <strong>Backend Status:</strong>{' '}
                <span style={{
                    color: backendStatus === 'success' ? 'green' : 'red',
                    fontWeight: 'bold',
                    fontSize: '20px'
                }}>
                    {backendStatus.toUpperCase()}
                </span>
            </div>

            {message && <p><strong>Message:</strong> {message}</p>}
            
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
            
            {loading && <p>🔄 Connecting to backend...</p>}
        </div>
    );
};

export default BackendStatus;