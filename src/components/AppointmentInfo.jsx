import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaUserMd, FaUser, FaCalendar, FaClock, FaStethoscope, FaFileAlt } from 'react-icons/fa';
import API from '../utils/api';

const AppointmentInfo = ({ appointmentId, userType }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [appointmentData, setAppointmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
    }
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/patient/appointment/${appointmentId}`);
      setAppointmentData(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch appointment:', err);
      setError('Could not load appointment details');
    } finally {
      setLoading(false);
    }
  };

  if (!appointmentId) {
    return null;
  }

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`fixed right-0 top-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl transition-all duration-300 z-20 ${
      isExpanded ? 'w-72' : 'w-14'
    }`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -left-3 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 p-1.5 rounded-full shadow-lg transition-all"
      >
        {isExpanded ? <FaChevronRight className="text-white text-xs" /> : <FaChevronLeft className="text-white text-xs" />}
      </button>

      {/* Header */}
      <div className={`bg-blue-600 p-3 ${!isExpanded && 'hidden'}`}>
        <h3 className="text-base font-bold">Appointment</h3>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="overflow-y-auto h-full pb-20 px-2 py-2">
          {loading ? (
            <div className="p-2 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-1 text-xs text-gray-300">Loading...</p>
            </div>
          ) : error ? (
            <div className="p-2">
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          ) : appointmentData ? (
            <div className="space-y-2">
              {/* Status Badge */}
              <div className={`px-2 py-1 rounded text-center text-xs font-semibold ${
                appointmentData.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                appointmentData.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                appointmentData.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {appointmentData.status?.charAt(0).toUpperCase() + appointmentData.status?.slice(1)}
              </div>

              {/* Doctor Info */}
              {userType === 'patient' && appointmentData.doctor && (
                <div className="bg-slate-700/50 p-2 rounded text-xs">
                  <p className="font-semibold text-blue-400 text-xs">{appointmentData.doctor.name}</p>
                  <p className="text-gray-400 text-xs">{appointmentData.doctor.specialization}</p>
                </div>
              )}

              {/* Patient Info */}
              {userType === 'doctor' && appointmentData.patient && (
                <div className="bg-slate-700/50 p-2 rounded text-xs">
                  <p className="font-semibold text-blue-400">{appointmentData.patient.name}</p>
                  <p className="text-gray-400 text-xs">{appointmentData.patient.email}</p>
                </div>
              )}

              {/* Date & Time */}
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-xs">
                  <FaCalendar className="text-blue-400 text-xs" />
                  <span className="text-xs">{formatDate(appointmentData.date)}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <FaClock className="text-blue-400 text-xs" />
                  <span className="text-xs">{appointmentData.startTime} - {appointmentData.endTime}</span>
                </div>
              </div>

              {/* Appointment Type */}
              <div className="bg-slate-700/50 p-2 rounded">
                <p className="text-xs font-semibold text-blue-400">Type</p>
                <p className="text-xs text-gray-300 capitalize">{appointmentData.appointmentType}</p>
              </div>

              {/* Consultation Fee */}
              {appointmentData.doctor?.consultationFee && (
                <div className="bg-slate-700/50 p-2 rounded">
                  <p className="text-xs text-gray-400">Fee</p>
                  <p className="text-sm font-bold text-green-400">₹{appointmentData.doctor.consultationFee}</p>
                </div>
              )}

              {/* Symptoms (if patient-side) */}
              {appointmentData.symptoms && (
                <div className="bg-slate-700/50 p-2 rounded">
                  <p className="text-xs font-semibold text-blue-400 mb-1">Symptoms</p>
                  <p className="text-xs text-gray-300 line-clamp-2">{appointmentData.symptoms}</p>
                </div>
              )}

              {/* Notes */}
              {appointmentData.notes && (
                <div className="bg-slate-700/50 p-2 rounded">
                  <p className="text-xs font-semibold text-blue-400 mb-1">Notes</p>
                  <p className="text-xs text-gray-300 line-clamp-2">{appointmentData.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-2 text-center">
              <p className="text-gray-400 text-xs">No data</p>
            </div>
          )}
        </div>
      )}

      {/* Collapsed State Icons */}
      {!isExpanded && (
        <div className="flex flex-col items-center space-y-3 p-1 mt-4">
          <div className="text-blue-400 text-lg" title="Appointment">
            <FaCalendar />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentInfo;
