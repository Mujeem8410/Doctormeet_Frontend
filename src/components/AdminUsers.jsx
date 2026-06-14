import React, { useEffect, useState } from "react";
import { FiCheckCircle, FiDownload, FiTrash2, FiUser, FiUsers } from "react-icons/fi";
import AdminNavbar from "./AdminNavbar";
import API from "../utils/api";
import { toast } from "react-toastify";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { saveAs } from "file-saver";
import Footer from "./Footer";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      if (!err.response?.data?.message?.toLowerCase().includes("token")) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
      toast.success("User deleted successfully!");
    } catch (err) {
      if (!err.response?.data?.message?.toLowerCase().includes("token")) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await API.put(`/admin/doctors/approve/${id}`);
      toast.success(res.data.message);
      fetchUsers();
    } catch (err) {
      if (!err.response?.data?.message?.toLowerCase().includes("token")) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleExportUsers = async () => {
    try {
      const res = await API.get("/admin/export/users", {
        responseType: "blob",
      });
      saveAs(res.data, "users.csv");
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const filteredUsers = users.filter((u) => u.role !== "admin");

  return (
    <div className="min-h-screen">
      <AdminNavbar />

      <div className="px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[26px] border border-white/60 bg-white/90 shadow-2xl backdrop-blur-xl">
            <div className="grid lg:grid-cols-[1fr_0.92fr]">
              <div className="bg-gradient-to-br from-sky-700 via-blue-600 to-cyan-500 p-6 text-white lg:p-8">
                <div className="mb-4 inline-flex rounded-full bg-white/15 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
                  User Management
                </div>
                <h1 className="text-[1.9rem] font-bold leading-tight sm:text-[1.8rem]">
                  Review, approve, and manage user accounts.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50">
                  Keep the platform clean and trusted by reviewing doctor
                  approvals, exporting user records, and managing account access.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-blue-100">
                      Visible Users
                    </p>
                    <p className="mt-3 text-3xl font-bold">{filteredUsers.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-blue-100">
                      Pending Doctors
                    </p>
                    <p className="mt-3 text-3xl font-bold">
                      {
                        filteredUsers.filter(
                          (u) => u.role === "doctor" && !u.isApproved
                        ).length
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
                        Admin controls
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
                      onClick={handleExportUsers}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      <FiDownload size={16} />
                      Export Users CSV
                    </button>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        Approve pending doctors and remove unwanted accounts from
                        the platform.
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
                  User Directory
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Manage Users
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Review every patient and doctor account from one clean admin
                  table.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-[22px] border border-slate-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">User</th>
                    <th className="px-5 py-4 font-semibold">Role</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 text-center font-semibold">Approval</th>
                    <th className="px-5 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={u.profileImage} size={42} />
                          <div>
                            <p className="font-semibold text-slate-900">{u.name}</p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {u.role === "doctor"
                            ? `Doctor${u.specialization ? ` - ${u.specialization}` : ""}`
                            : "Patient"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {u.role === "doctor" ? (
                          u.isApproved ? (
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                              Approved
                            </span>
                          ) : (
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                              Pending Approval
                            </span>
                          )
                        ) : (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            Active User
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {u.role === "doctor" ? (
                          !u.isApproved ? (
                            <button
                              onClick={() => handleApprove(u._id)}
                              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                              <FiCheckCircle size={16} />
                              Approve
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                              <FiCheckCircle size={16} />
                              Approved
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-500">
                            <FiUser size={16} />
                            No approval needed
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                        >
                          <FiTrash2 size={16} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                        No users found
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

export default AdminUsers;
