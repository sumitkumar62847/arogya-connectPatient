import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';

// import dotenv from 'dotenv';
// dotenv.config(); 
// --- Configuration ---
const Api =  process.env.REACT_APP_API_URL;


const ProtectedRoute = ({ allowedRoles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login'); 
        return;
      }

      try {
        const response = await axios.get(`${Api}/verifyTokenUser`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const userRole = response.data.user.role;
        localStorage.setItem('PatientId', response.data.user.id);
        if (allowedRoles && allowedRoles.includes(userRole)){
          setIsAuthorized(true);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        localStorage.removeItem('authToken');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, allowedRoles]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <LoaderCircle className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return isAuthorized ? <Outlet /> : null;
};

export default ProtectedRoute;