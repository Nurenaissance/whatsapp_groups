import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, Check } from 'lucide-react';
import { useAuth } from './authContext';
import logo from '../public/logo.png';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post('https://backeng4whatsapp-dxbmgpakhzf9bped.centralindia-01.azurewebsites.net/login/', { username, password });
      
      if (response.status === 200) {
        const userData = {
          userId: response.data.user_id,
          tenantId: response.data.tenant_id,
          role: response.data.role,
          model: response.data.model
        };

        login(userData);
        // Navigate to the tenant-specific messages page as the default home
        navigate(`/${userData.tenantId}/home`);
      }
    } catch (error) {
      setError('Invalid credentials. Please try again.');
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen min-w-full flex items-center justify-center bg-gray-100 absolute inset-0">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
        <div className="text-center mb-6">
          <img src={logo} alt="Company Logo" className="mx-auto h-16 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              className="w-full pl-10 p-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;