import React, { useEffect, useState } from "react";
import {
  FiActivity,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMessageSquare,
  FiShield,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import AdminNavbar from "../components/AdminNavbar";
import API from "../utils/api";
import { toast } from "react-toastify";
import DashboardCharts from "../components/DashboardCharts";
import Footer from "../components/Footer";
import LoadingState from "../components/LoadingState";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => {
        toast.error("Failed to load stats");
        console.error(err);
      });
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen">
        <AdminNavbar />
        <div className="px-4 pb-10 pt-28 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <LoadingState message="Loading admin dashboard..." />
          </div>
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: <FiUsers size={18} />,
      tone: "from-sky-500 to-blue-600",
    },
    {
      label: "Doctors",
      value: stats.totalDoctors,
      icon: <FiUserCheck size={18} />,
      tone: "from-cyan-500 to-blue-500",
    },
    {
      label: "Patients",
      value: stats.totalPatients,
      icon: <FiShield size={18} />,
      tone: "from-violet-500 to-blue-500",
    },
    {
      label: "Appointments",
      value: stats.totalAppointments,
      icon: <FiCalendar size={18} />,
      tone: "from-emerald-500 to-teal-500",
    },
    {
      label: "Reviews",
      value: stats.totalReviews,
      icon: <FiMessageSquare size={18} />,
      tone: "from-amber-500 to-orange-500",
    },
    {
      label: "Today's Appointments",
      value: stats.todaysAppointments,
      icon: <FiActivity size={18} />,
      tone: "from-rose-500 to-pink-500",
    },
    {
      label: "Pending",
      value: stats.pendingAppointments,
      icon: <FiClock size={18} />,
      tone: "from-yellow-500 to-amber-500",
    },
    {
      label: "Confirmed",
      value: stats.confirmedAppointments,
      icon: <FiCheckCircle size={18} />,
      tone: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen">
      <AdminNavbar />

      <div className="px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[26px] border border-white/60 bg-white/90 shadow-2xl backdrop-blur-xl">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="bg-gradient-to-br from-sky-700 via-blue-600 to-cyan-500 p-6 text-white lg:p-8">
                <div className="mb-4 inline-flex rounded-full bg-white/15 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
                  Admin Overview
                </div>
                <h1 className="text-[1.9rem] font-bold leading-tight sm:text-[1.75rem]">
                  Control the full DocMeet ecosystem with clarity.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50">
                  Monitor users, appointments, reviews, and operational health
                  from one premium admin workspace built for fast decisions.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {cards.slice(0, 4).map((card) => (
                    <div
                      key={card.label}
                      className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.18em] text-blue-100">
                          {card.label}
                        </span>
                        {card.icon}
                      </div>
                      <p className="mt-3 text-3xl font-bold">{card.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 sm:p-6 lg:p-8">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Highlights
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    Hospital summary at a glance
                  </h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {cards.slice(4).map((card) => (
                      <div
                        key={card.label}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-600">
                            {card.label}
                          </p>
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tone} text-white shadow-sm`}
                          >
                            {card.icon}
                          </span>
                        </div>
                        <p className="mt-3 text-3xl font-bold text-slate-900">
                          {card.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[26px] border border-white/60 bg-white/90 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Analytics
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Analytics Overview
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Track platform movement and performance trends across the admin
                system.
              </p>
            </div>
            <DashboardCharts />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
