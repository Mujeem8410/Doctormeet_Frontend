import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./AuPublic/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfilePage from "./pages/ProfilePage";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./helper/PrivateRoute";
import AdminUsers from "./components/AdminUsers";
import AdminAppointments from "./components/AdminAppointments";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/ForgotPassword";
import VideoCall from "./components/VideoCall";
import DoctorVideoCall from "./components/DoctorVideoCall";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { SOCKET_URL } from "./utils/runtimeConfig";

function App() {
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('notification', (data) => {
      toast[data.type || 'info'](data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Video Call Routes */}
          <Route path="/video-call/:roomId" element={<VideoCall />} />
          <Route path="/video-call/:roomId/:appointmentId" element={<VideoCall />} />
          <Route path="/doctor/video-call/:roomId" element={<DoctorVideoCall />} />
          <Route path="/doctor/video-call/:roomId/:appointmentId" element={<DoctorVideoCall />} />

          {/* Role-Based Routes */}
          <Route path="/patient/dashboard" element={
            <PrivateRoute role="patient">
              <PatientDashboard />
            </PrivateRoute>
          } />
          <Route path="/doctor/dashboard" element={
            <PrivateRoute role="doctor">
              <DoctorDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/dashboard" element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute role="admin">
              <AdminUsers />
            </PrivateRoute>
          } />
          <Route path="/admin/appointments" element={
            <PrivateRoute role="admin">
              <AdminAppointments />
            </PrivateRoute>
          } />
        </Routes>
      </Router>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
