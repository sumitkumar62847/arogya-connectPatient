import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollHandle';
import Home from './pages/home';
import './App.css'
import LoginCard from './components/loginCard';
import RegisterCard from './components/Register';
import PatientPortal from './pages/HomeWithData';
import ProtectedRoute from './components/ProtectedRoute'; // 1. Import the new component

function App() {
  return (
    <div>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes: Accessible to everyone */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginCard />} />
          <Route path='/register' element={<RegisterCard />} />
          
          
          <Route element={<ProtectedRoute allowedRoles={['Patient']} />}>
            <Route path='/patient' element={<PatientPortal />} />
            {/* You can add more patient-only routes here if needed */}
          </Route>

        </Routes>
      </Router>
    </div>
  );
}

export default App;