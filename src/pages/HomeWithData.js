import React, { useState, useEffect } from 'react';
import {
  LogOut, Calendar, Heart, Pill,
  ArrowLeft, CalendarCheck, Thermometer, Stethoscope, Microscope,
  Download, Eye, LoaderCircle, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import dotenv from 'dotenv';
// dotenv.config(); 
// --- Configuration ---
const API_BASE_URL =  process.env.REACT_APP_API_URL;


const calculateAge = (dobString) => {
    if (!dobString) return 'N/A';
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};


const PatientPortal = () => {
  const [view, setView] = useState('dashboard');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [portalData, setPortalData] = useState({ patient: null, appointments: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortalData = async () => {
      const patientId = localStorage.getItem('PatientId');
      if (!patientId) {
        setError("Patient ID not found. Please log in again.");
        setIsLoading(false);
        return;
      }
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/appointmentbyPId`,{
            params:{
                patientId:`${patientId}`
            },
            headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPortalData(response.data);
      } catch (err) {
        console.error("Failed to fetch patient portal data:", err);
        setError("Could not load your health data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortalData();
  }, []);

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setView('details');
  };

  const handleBackToDashboard = () => {
    setSelectedAppointment(null);
    setView('dashboard');
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><LoaderCircle className="h-12 w-12 animate-spin text-gray-500" /></div>;
  }
  
  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-500"><AlertCircle className="h-6 w-6 mr-2"/> {error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header patient={portalData.patient} />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {view === 'dashboard' ? (
            <DashboardView
              patient={portalData.patient}
              appointments={portalData.appointments}
              onViewDetails={handleViewDetails}
            />
          ) : (
            <AppointmentDetailsView
              appointment={selectedAppointment}
              onBack={handleBackToDashboard}
            />
          )}
        </div>
      </main>
    </div>
  );
};


const Header = ({ patient }) => (
    <header className="bg-white shadow-md px-6 py-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Arogya Connect | My Health</h1>
            {patient && (
                 <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <img src={`https://placehold.co/40x40/E2E8F0/4A5568?text=${patient.fullName.charAt(0)}`} alt="Patient" className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-semibold text-sm">{patient.fullName}</p>
                            <p className="text-xs text-gray-500">Patient ID: {patient._id.slice(-6)}</p>
                        </div>
                    </div>
                    <button className="text-gray-500 hover:text-red-600"><LogOut className="h-6 w-6" /></button>
                </div>
            )}
        </div>
    </header>
);

const DashboardView = ({ patient, appointments, onViewDetails }) => (
    <div>
        <div className="flex items-center justify-between mb-6"><h2 className="text-3xl font-bold text-gray-800">My Health Dashboard</h2><div className="flex items-center space-x-2 text-sm text-gray-600"><Calendar className="h-4 w-4" /><span>Last Updated: {formatDate(new Date())}</span></div></div>
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg p-6 mb-8 text-white"><div className="flex items-center justify-between"><div className="w-full"><h3 className="text-xl font-bold mb-2">Health Summary</h3><div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"><div><p className="opacity-80">Age</p><p className="font-semibold text-lg">{calculateAge(patient.dob)} years</p></div><div><p className="opacity-80">Blood Group</p><p className="font-semibold text-lg">{patient.bloodGroup}</p></div><div><p className="opacity-80">Total Visits</p><p className="font-semibold text-lg">{appointments.length}</p></div><div><p className="opacity-80">Last Visit</p><p className="font-semibold text-lg">{appointments.length > 0 ? formatDate(appointments[0].createdAt) : 'N/A'}</p></div></div></div><div className="hidden md:flex items-center"><Heart className="h-16 w-16 opacity-20" /></div></div></div>
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{appointments.map(app => <AppointmentCard key={app._id} appointment={app} onViewDetails={() => onViewDetails(app)} />)}</div>
        </div>
    </div>
);

const AppointmentDetailsView = ({ appointment, onBack }) => (
    <div>
        <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-600 hover:text-black mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Back to My Appointments</button>
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-50 p-6 border-b"><div className="flex justify-between items-start"><div><div className="flex items-center space-x-3 mb-2"><CalendarCheck className="h-6 w-6 text-purple-600" /><p className="font-bold text-xl">{formatDate(appointment.createdAt)}</p></div><p className="text-sm text-gray-600">{new Date(appointment.createdAt).toLocaleTimeString('en-US')} - General Physician</p><p className="text-sm text-gray-600 mt-1">{appointment.forwardTo}</p></div><span className="px-3 py-1 text-sm font-semibold rounded-full bg-orange-100 text-orange-800">{appointment.status}</span></div></div>
                <div className="p-6 bg-blue-50 border-b"><h4 className="font-bold text-gray-600 mb-4 text-sm uppercase flex items-center"><Thermometer className="h-4 w-4 mr-2" />Initial Health Assessment</h4><div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4"><div className="bg-white p-3 rounded-md"><p className="text-gray-500">Temperature</p><p className="font-semibold text-lg">{appointment.assessment?.temp || 'N/A'}</p></div><div className="bg-white p-3 rounded-md"><p className="text-gray-500">Blood Pressure</p><p className="font-semibold text-lg">{appointment.assessment?.bp || 'N/A'}</p></div><div className="bg-white p-3 rounded-md"><p className="text-gray-500">Pulse Rate</p><p className="font-semibold text-lg">{appointment.assessment?.pulse || 'N/A'}</p></div><div className="bg-white p-3 rounded-md"><p className="text-gray-500">Weight</p><p className="font-semibold text-lg">{appointment.assessment?.weight || 'N/A'}</p></div></div><div className="bg-white p-3 rounded-md"><p className="text-gray-500 text-sm font-semibold mb-2">Symptoms Noted:</p><p className="text-sm">{appointment.assessment?.notes || 'N/A'}</p></div></div>
                <div className="p-6 border-b"><h4 className="font-bold text-gray-800 mb-4 text-sm uppercase flex items-center"><Stethoscope className="h-4 w-4 mr-2" />Doctor's Diagnosis & Treatment</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="bg-purple-50 p-4 rounded-md"><p className="text-purple-800 font-semibold text-sm mb-2">Primary Diagnosis</p><p className="font-bold text-lg">{appointment.doctorNotes?.diagnosis || 'N/A'}</p></div><div className="bg-green-50 p-4 rounded-md"><p className="text-green-800 font-semibold text-sm mb-2">Doctor's Notes</p><p className="text-sm text-gray-700">{appointment.doctorNotes?.notes || 'N/A'}</p></div></div></div>
                <div className="p-6 bg-green-50 border-b"><h4 className="font-bold text-gray-800 mb-4 text-sm uppercase flex items-center"><Pill className="h-4 w-4 mr-2" />Prescribed Medicines</h4><div className="space-y-3">{appointment.doctorNotes?.prescriptions?.map((med, i) => <MedicineItem key={i} medicine={med} />)}</div></div>
                <div className="p-6 bg-yellow-50 border-b"><h4 className="font-bold text-gray-800 mb-4 text-sm uppercase flex items-center"><Microscope className="h-4 w-4 mr-2" />Lab Tests Ordered</h4><div className="space-y-3">{appointment.doctorNotes?.labTests?.length > 0 ? appointment.doctorNotes.labTests.map((test, i) => <LabTestItem key={i} testName={test} />) : <p className="text-sm text-gray-600 italic">No lab tests ordered for this visit.</p>}</div></div>
            </div>
        </div>
    </div>
);

const AppointmentCard = ({ appointment, onViewDetails }) => {
    const statusInfo = {
        'Pending Doctor': { color: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-500' },
        'Pending Lab': { color: 'bg-blue-100 text-blue-800', border: 'border-blue-500' },
        'Pending Dispenser': { color: 'bg-orange-100 text-orange-800', border: 'border-orange-500' },
        'Completed': { color: 'bg-green-100 text-green-800', border: 'border-green-500' },
        'Cancelled': { color: 'bg-red-100 text-red-800', border: 'border-red-500' },
    };
    const currentStatus = statusInfo[appointment.status] || statusInfo['Completed'];
    return (
        <div onClick={onViewDetails} className={`appointment-card bg-white rounded-lg shadow-sm ${currentStatus.border} border-l-4 cursor-pointer`}>
            <div className="p-4">
                <div className="flex justify-between items-start mb-3"><div><div className="flex items-center space-x-2 mb-1"><Calendar className="h-4 w-4 text-gray-500" /><p className="font-bold text-lg">{formatDate(appointment.createdAt)}</p></div><p className="text-sm text-gray-700 font-semibold">{appointment.forwardTo}</p></div><span className={`px-2 py-1 text-xs font-semibold rounded-full ${currentStatus.color}`}>{appointment.status}</span></div>
                <div className="border-t pt-3 mb-3"><p className="text-xs text-gray-500 font-semibold mb-1">DIAGNOSIS</p><p className="text-sm font-semibold text-gray-800">{appointment.doctorNotes?.diagnosis || 'Pending'}</p></div>
                <div className="grid grid-cols-2 gap-4 text-center mb-3"><div className="bg-green-50 p-2 rounded-md"><p className="text-xs text-gray-500">Medicines</p><p className="font-bold text-green-600">{appointment.doctorNotes?.prescriptions?.length || 0}</p></div><div className="bg-blue-50 p-2 rounded-md"><p className="text-xs text-gray-500">Lab Tests</p><p className="font-bold text-blue-600">{appointment.doctorNotes?.labTests?.length || 0}</p></div></div>
            </div>
            <div className="bg-gray-50 px-4 py-2 rounded-b-lg"><p className="text-xs text-gray-600 flex items-center"><Eye className="h-3 w-3 mr-1" />Click to view details</p></div>
        </div>
    );
};

const MedicineItem = ({ medicine }) => (
    <div className="bg-white border border-gray-200 rounded-md p-3"><div className="flex items-center justify-between"><div className="flex-1"><p className="font-semibold text-gray-800">{medicine.name}</p><div className="grid grid-cols-2 gap-4 text-sm text-gray-600"><div><p className="text-xs text-gray-500">Dosage</p><p className="font-medium">{medicine.dosage}</p></div><div><p className="text-xs text-gray-500">Frequency</p><p className="font-medium">{medicine.freq}</p></div></div></div></div></div>
);

const LabTestItem = ({ testName }) => (
    <div className="bg-white border border-gray-200 rounded-md p-3">
        <div className="flex items-center justify-between"><p className="font-semibold text-gray-800">{testName}</p><span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span></div>
    </div>
);

export default PatientPortal;
