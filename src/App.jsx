import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./helper/PrivateRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import { SOCKET_URL } from "./utils/runtimeConfig";

const Home = lazy(() => import("./AuPublic/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const PatientDashboard = lazy(() => import("./pages/PatientDashboard"));
const DoctorDashboard = lazy(() => import("./pages/DoctorDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./components/AdminUsers"));
const AdminAppointments = lazy(() => import("./components/AdminAppointments"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const VideoCall = lazy(() => import("./components/VideoCall"));
const DoctorVideoCall = lazy(() => import("./components/DoctorVideoCall"));

function RouteFallback() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 text-slate-600">
      <div className="mx-auto flex max-w-5xl items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-10 text-sm font-medium shadow-sm">
        Loading DocMeet...
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    // Connection event listeners
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Listen for notifications
    socket.on("notification", (data) => {
      console.log("📢 Notification received:", data);
      if (data.message && data.type) {
        toast[data.type || "info"](data.message);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Router>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/video-call/:roomId" element={<VideoCall />} />
            <Route path="/video-call/:roomId/:appointmentId" element={<VideoCall />} />
            <Route path="/doctor/video-call/:roomId" element={<DoctorVideoCall />} />
            <Route path="/doctor/video-call/:roomId/:appointmentId" element={<DoctorVideoCall />} />

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
        </Suspense>
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
