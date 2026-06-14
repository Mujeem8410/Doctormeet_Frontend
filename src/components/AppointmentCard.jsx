import React from "react";
import API from "../utils/api";
import { toast } from "react-toastify";

const AppointmentCard = ({ appointment, refresh }) => {
  const handleDoctorVideoCall = async (roomId) => {
    try {
      const accessRes = await API.get(`/video/check-access/${roomId}`);
      
      if (accessRes.data.accessible) {
        window.open(`/doctor/video-call/${roomId}`, '_blank', 'width=1200,height=700');
      } else {
        toast.info(accessRes.data.message);
      }
    } catch (error) {
      console.error('Video call access error:', error);
      toast.error('Cannot start video call at this time');
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Patient: {appointment.patient?.name}</h3>
          <p><strong>Date:</strong> {appointment.date}</p>
          <p><strong>Time:</strong> {appointment.startTime} - {appointment.endTime}</p>
          <p><strong>Type:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              appointment.appointmentType === 'video' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {appointment.appointmentType === 'video' ? '📹 Video' : '🏥 Clinic'}
            </span>
          </p>
          <p><strong>Status:</strong> 
            <span className={`ml-2 font-semibold ${
              appointment.status === 'confirmed' ? 'text-green-600' :
              appointment.status === 'pending' ? 'text-yellow-600' :
              appointment.status === 'completed' ? 'text-blue-600' :
              'text-gray-600'
            }`}>
              {appointment.status.toUpperCase()}
            </span>
          </p>
          {appointment.symptoms && (
            <p><strong>Symptoms:</strong> {appointment.symptoms}</p>
          )}
        </div>
        
        <div className="flex flex-col gap-2 ml-4">
          {appointment.status === 'pending' && (
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  try {
                    await API.put(`/doctor/appointments/${appointment._id}/confirm`);
                    toast.success("Appointment confirmed");
                    refresh();
                  } catch (err) {
                    toast.error("Failed to confirm appointment");
                  }
                }}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Confirm
              </button>
              <button
                onClick={async () => {
                  try {
                    await API.put(`/doctor/appointments/${appointment._id}/reject`);
                    toast.success("Appointment rejected");
                    refresh();
                  } catch (err) {
                    toast.error("Failed to reject appointment");
                  }
                }}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          )}

          {/* Video Call Button */}
          {appointment.appointmentType === 'video' && appointment.status === 'confirmed' && (
            <button
              onClick={() => handleDoctorVideoCall(appointment.roomId)}
              className="bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 flex items-center gap-2"
            >
              📹 Start Video Call
            </button>
          )}

          {appointment.status === 'confirmed' && (
            <button
              onClick={async () => {
                try {
                  await API.put(`/doctor/appointments/${appointment._id}/complete`);
                  toast.success("Appointment marked as completed");
                  refresh();
                } catch (err) {
                  toast.error("Failed to complete appointment");
                }
              }}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Mark Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;