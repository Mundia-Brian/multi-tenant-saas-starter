import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tenant, setTenant] = useState('');

  useEffect(() => {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    setTenant(subdomain);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to {tenant}'s Portal</h1>
      <p className="mt-4 text-gray-700">This is your multi-tenant SaaS frontend.</p>
    </div>
  );
}

export default App;
