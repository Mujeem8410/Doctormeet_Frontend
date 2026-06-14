import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiUser,
  FiVideo,
  FiXCircle,
} from "react-icons/fi";
import API from "../utils/api";
import DoctorNavbar from "../components/DoctorNavbar";
import Footer from "../components/Footer";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentAppt, setCurrentAppt] = useState(null);
  const [prescriptionText, setPrescriptionText] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/doctor/appointments");
      setAppointments(res.data);
    } catch (err) {
      if (!err.response?.data?.message?.toLowerCase().includes("token")) {
        toast.error(err.response?.data?.message || "Error fetching appointments");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorVideoCall = async (roomId) => {
    try {
      const accessRes = await API.get(`/video/check-access/${roomId}`);

      if (accessRes.data.accessible) {
        window.open(
          `/doctor/video-call/${roomId}`,
          "_blank",
          "width=1200,height=700"
        );
      } else {
        toast.info(accessRes.data.message);
      }
    } catch (error) {
      console.error("Video call access error:", error);
      toast.error("Cannot start video call at this time");
    }
  };

  const handleFinalComplete = async () => {
    if (currentAppt.appointmentType === "video" && !prescriptionText.trim()) {
      toast.error(
        "Please write the prescription before completing a video appointment."
      );
      return;
    }

    try {
      const payload =
        currentAppt.appointmentType === "video"
          ? { prescription: prescriptionText }
          : {};

      await API.put(`/doctor/appointments/${currentAppt._id}/completed`, payload);

      if (currentAppt.appointmentType === "video") {
        toast.success("Appointment completed and prescription sent via email.");
      } else {
        toast.success("Appointment marked as completed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete appointment.");
    } finally {
      setShowModal(false);
      setPrescriptionText("");
      setCurrentAppt(null);
      fetchAppointments();
    }
  };

  const openCompleteModal = (appt) => {
    setCurrentAppt(appt);
    setPrescriptionText("");
    setShowModal(true);
  };

  const pendingCount = appointments.filter((appt) => appt.status === "pending").length;
  const confirmedCount = appointments.filter(
    (appt) => appt.status === "confirmed"
  ).length;
  const completedCount = appointments.filter(
    (appt) => appt.status === "completed"
  ).length;
  const videoCount = appointments.filter(
    (appt) => appt.appointmentType === "video"
  ).length;

  useEffect(() => {
    fetchAppointments();
  }, []);

  const statusBadgeClass = (status) => {
    if (status === "confirmed") {
      return "bg-emerald-100 text-emerald-700";
    }
    if (status === "pending") {
      return "bg-amber-100 text-amber-700";
    }
    if (status === "completed") {
      return "bg-blue-100 text-blue-700";
    }
    return "bg-slate-100 text-slate-600";
  };

  const appointmentTypeBadgeClass = (type) => {
    return type === "video"
      ? "bg-violet-100 text-violet-700"
      : "bg-sky-100 text-sky-700";
  };

  return (
    <div className="min-h-screen">
      <DoctorNavbar />

      <div className="px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[26px] border border-white/60 bg-white/90 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="bg-gradient-to-br from-sky-700 via-blue-600 to-cyan-500 p-6 text-white lg:p-8">
                <div className="mb-4 inline-flex rounded-full bg-white/15 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
                  Doctor Workspace
                </div>
                <h2 className="text-[1.5rem] font-bold leading-tight sm:text-[1.75rem]">
                  Manage appointments with clarity and speed.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50">
                  Track patient bookings, confirm visits, handle video calls,
                  and complete consultations from one clean doctor dashboard.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.18em] text-blue-100">
                        Total
                      </span>
                      <FiCalendar size={16} />
                    </div>
                    <p className="mt-3 text-3xl font-bold">{appointments.length}</p>
                    <p className="mt-1 text-sm text-blue-100">Appointments</p>
                  </div>

                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.18em] text-blue-100">
                        Pending
                      </span>
                      <FiClock size={16} />
                    </div>
                    <p className="mt-3 text-3xl font-bold">{pendingCount}</p>
                    <p className="mt-1 text-sm text-blue-100">Awaiting review</p>
                  </div>

                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.18em] text-blue-100">
                        Confirmed
                      </span>
                      <FiCheckCircle size={16} />
                    </div>
                    <p className="mt-3 text-3xl font-bold">{confirmedCount}</p>
                    <p className="mt-1 text-sm text-blue-100">Ready to attend</p>
                  </div>

                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.18em] text-blue-100">
                        Video
                      </span>
                      <FiVideo size={16} />
                    </div>
                    <p className="mt-3 text-3xl font-bold">{videoCount}</p>
                    <p className="mt-1 text-sm text-blue-100">Online consults</p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 lg:p-8">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Doctor Overview
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-slate-900">
                        Dr. {user.name || "Doctor"}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {user.specialization || "Healthcare professional"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Completed
                      </p>
                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        {completedCount}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800">
                        Review pending requests and respond quickly.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800">
                        Start video consultations when the appointment is confirmed.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800">
                        Complete visits with prescription notes when required.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
         
          <div className="mt-6 rounded-[26px] border border-white/60 bg-white/90 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Appointment Queue
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Doctor Dashboard
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  View, confirm, reject, and complete your patient appointments.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-10 text-center text-slate-500">
                Loading appointments...
              </div>
            ) : appointments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <FiCalendar size={22} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  No appointments yet
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Once patients start booking, your appointments will appear here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {appointments.map((appt) => (
                  <div
                    key={appt._id}
                    className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                            <FiUser size={18} className="text-blue-600" />
                            {appt.patient?.name}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${appointmentTypeBadgeClass(
                              appt.appointmentType
                            )}`}
                          >
                            {appt.appointmentType === "video" ? "Video" : "Clinic"}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(
                              appt.status
                            )}`}
                          >
                            {appt.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                          <p>
                            <span className="font-semibold text-slate-800">Date:</span>{" "}
                            {appt.date}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-800">Time:</span>{" "}
                            {appt.startTime} - {appt.endTime}
                          </p>
                        </div>

                        {appt.symptoms && (
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                            <span className="font-semibold text-slate-800">
                              Symptoms:
                            </span>{" "}
                            {appt.symptoms}
                          </div>
                        )}
                      </div>

                      <div className="flex w-full flex-col gap-2 sm:w-auto">
                        {appt.status === "pending" && (
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={async () => {
                                try {
                                  await API.put(
                                    `/doctor/appointments/${appt._id}/confirmed`
                                  );
                                  toast.success("Appointment confirmed");
                                  fetchAppointments();
                                } catch (err) {
                                  toast.error("Failed to confirm appointment");
                                  console.error(err);
                                }
                              }}
                              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  await API.put(
                                    `/doctor/appointments/${appt._id}/reject`
                                  );
                                  toast.success("Appointment rejected");
                                  fetchAppointments();
                                } catch (err) {
                                  console.error(err);
                                  toast.error("Failed to reject appointment");
                                }
                              }}
                              className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {appt.appointmentType === "video" &&
                          appt.status === "confirmed" && (
                            <button
                              onClick={() => handleDoctorVideoCall(appt.roomId)}
                              className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
                            >
                              <FiVideo size={16} />
                              Start Video Call
                            </button>
                          )}

                        {appt.status === "confirmed" && (
                          <button
                            onClick={() => openCompleteModal(appt)}
                            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && currentAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-[26px] border border-white/60 bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-sky-700 via-blue-600 to-cyan-500 px-6 py-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                Complete Appointment
              </p>
              <h3 className="mt-2 text-2xl font-bold">
                Finalize: {currentAppt.patient?.name}
              </h3>
              <p className="mt-2 text-sm text-blue-50">
                Close the consultation and add any final notes if this was a
                video appointment.
              </p>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Patient
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {currentAppt.patient?.name}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Appointment Type
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {currentAppt.appointmentType === "video" ? "Video" : "Clinic"}
                  </p>
                </div>
              </div>

              {currentAppt.appointmentType === "video" && (
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <FiFileText size={16} />
                    Prescription Details
                  </label>
                  <textarea
                    value={prescriptionText}
                    onChange={(e) => setPrescriptionText(e.target.value)}
                    placeholder="e.g., Medicine A (1-0-1), rest for 3 days, follow-up after 1 week."
                    rows="8"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              )}

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalComplete}
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {currentAppt.appointmentType === "video"
                    ? "Complete and Send Prescription"
                    : "Complete Appointment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default DoctorDashboard;
