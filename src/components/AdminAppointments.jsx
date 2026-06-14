import React, { useEffect, useState } from "react";
import { FiCalendar, FiDownload, FiFileText, FiUser } from "react-icons/fi";
import AdminNavbar from "../components/AdminNavbar";
import API from "../utils/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { saveAs } from "file-saver";
import Footer from "../components/Footer";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/admin/appointments");
      setAppointments(res.data);
    } catch (err) {
      if (!err.response?.data?.message?.toLowerCase().includes("token")) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleExportAppointments = async () => {
    try {
      const res = await API.get("/admin/export/appointments", {
        responseType: "blob",
      });

      saveAs(res.data, "appointments.csv");
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const statusClass = (status) => {
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

  return (
    <div className="min-h-screen">
      <AdminNavbar />

      <div className="px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[26px] border border-white/60 bg-white/90 shadow-2xl backdrop-blur-xl">
            <div className="grid lg:grid-cols-[1fr_0.92fr]">
              <div className="bg-gradient-to-br from-sky-700 via-blue-600 to-cyan-500 p-6 text-white lg:p-8">
                <div className="mb-4 inline-flex rounded-full bg-white/15 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
                  Appointment Control
                </div>
                <h1 className="text-[1.9rem] font-bold leading-tight sm:text-[1.8rem]">
                  Review booking activity across the platform.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50">
                  Keep track of doctor and patient appointment flow, export
                  records, and monitor platform activity from one clean admin
                  appointment view.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-blue-100">
                      Total Records
                    </p>
                    <p className="mt-3 text-3xl font-bold">{appointments.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-blue-100">
                      Confirmed
                    </p>
                    <p className="mt-3 text-3xl font-bold">
                      {
                        appointments.filter((appointment) => appointment.status === "confirmed")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 lg:p-8">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Quick Actions
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-slate-900">
                        Appointment tools
                      </h2>
                    </div>
                    <Link
                      to="/admin/dashboard"
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Dashboard
                    </Link>
                  </div>

                  <div className="mt-5 space-y-3">
                    <button
                      onClick={handleExportAppointments}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      <FiDownload size={16} />
                      Export Appointment CSV
                    </button>

                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        Audit doctor-patient appointments and platform activity
                        without leaving the admin workspace.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[26px] border border-white/60 bg-white/90 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Appointment Records
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Manage Appointments
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Track doctor and patient booking records in one premium admin
                table.
              </p>
            </div>

            <div className="overflow-x-auto rounded-[22px] border border-slate-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Doctor</th>
                    <th className="px-5 py-4 font-semibold">Patient</th>
                    <th className="px-5 py-4 font-semibold">Schedule</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {appointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <FiUser size={18} />
                          </span>
                          <div>
                            <p className="font-semibold text-slate-900">
                              Dr. {appointment.doctor?.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {appointment.doctor?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                            <FiUser size={18} />
                          </span>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {appointment.patient?.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {appointment.patient?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                            <FiCalendar size={18} />
                          </span>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {appointment.date}
                            </p>
                            <p className="text-xs text-slate-500">
                              {appointment.time}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                            appointment.status
                          )}`}
                        >
                          <FiFileText size={14} />
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {appointments.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center text-slate-500">
                        No appointments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminAppointments;
