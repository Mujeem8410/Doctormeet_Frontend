import { useState, useEffect } from "react";
import {
  FiCamera,
  FiCheckCircle,
  FiEdit3,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";
import API from "../utils/api";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import Avatar from "../components/Avatar";

const ProfilePage = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({ current: "", newPass: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [waiting, setWaiting] = useState(false);

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100";
  const cardClass =
    "rounded-[24px] border border-slate-200 bg-white/95 p-5 shadow-sm sm:p-6";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile/me");
        setUser(res.data);

        if (res.data.profileImage) {
          setPreview(res.data.profileImage);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const goToDashboard = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData.role === "doctor") {
      window.location.href = "/doctor/dashboard";
    } else if (userData.role === "patient") {
      window.location.href = "/patient/dashboard";
    } else {
      window.location.href = "/admin/dashboard";
    }
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (!imageFile) return toast.error("Please select an image");

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      setWaiting(true);
      const res = await API.put("/profile/upload-profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Image uploaded!");
      setWaiting(false);
      setUser(res.data);

      const userData = JSON.parse(localStorage.getItem("user"));
      userData.profileImage = res.data.profileImage;
      localStorage.setItem("user", JSON.stringify(userData));

      setPreview(res.data.profileImage);
      setImageFile(null);
    } catch (err) {
      setWaiting(false);
      toast.error(err.response?.data?.message || "Image upload failed");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/profile/update", user);
      toast.success("Profile updated");
      localStorage.setItem("user", JSON.stringify(res.data));
      setTimeout(() => {
        goToDashboard();
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.current === passwords.newPass) {
      return toast.error("Current and new passwords cannot be the same");
    }
    try {
      await API.put("/profile/change-password", passwords);
      toast.success("Password changed successfully");
      setPasswords({ current: "", newPass: "" });
      setTimeout(() => {
        goToDashboard();
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    }
  };

  return (
    <>
      {waiting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 backdrop-blur-sm">
          <div className="rounded-2xl bg-white px-6 py-4 text-base font-semibold text-slate-800 shadow-2xl">
            Updating Profile...
          </div>
        </div>
      )}

      <div className="px-4 pb-10 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/90 shadow-2xl backdrop-blur-xl">
            <div className="grid lg:grid-cols-[1fr_1.15fr]">
              <div className="bg-gradient-to-br from-sky-700 via-blue-600 to-cyan-500 p-6 text-white sm:p-8">
                <div className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                  Account Center
                </div>
                <h1 className="text-3xl font-bold leading-tight sm:text-[2.5rem]">
                  Manage your DocMeet profile with confidence.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-blue-50">
                  Keep your account details updated, refresh your profile image,
                  and secure your account from one clean profile workspace.
                </p>

                <div className="mt-8 rounded-[24px] border border-white/20 bg-white/10 p-5">
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={preview || user.profileImage}
                      size={92}
                      alt={user.name || "Profile"}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-xl font-semibold">
                        {user.name || "Your Profile"}
                      </p>
                      <p className="truncate text-sm text-blue-100">
                        {user.email || "DocMeet account"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4">
                    <div className="flex items-center gap-2 text-blue-100">
                      <FiCamera size={16} />
                      <span className="text-xs uppercase tracking-[0.18em]">
                        Profile Image
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold">
                      Upload a clean profile picture for a better identity.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4">
                    <div className="flex items-center gap-2 text-blue-100">
                      <FiLock size={16} />
                      <span className="text-xs uppercase tracking-[0.18em]">
                        Security
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold">
                      Change your password to keep your account protected.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/60 p-5 sm:p-6 lg:p-8">
                <div className="grid gap-5">
                  <div className={cardClass}>
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <FiCamera size={18} />
                      </span>
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          Profile Photo
                        </p>
                        <p className="text-sm text-slate-500">
                          Upload a premium-looking account image
                        </p>
                      </div>
                    </div>

                    <form
                      onSubmit={handleUploadImage}
                      className="flex flex-col items-center gap-4"
                    >
                      <label className="group relative cursor-pointer">
                        <div className="absolute inset-0 rounded-full bg-slate-900/0 transition group-hover:bg-slate-900/10" />
                        <Avatar
                          src={
                            preview ||
                            "https://images.unsplash.com/photo-1544502062-f82887f03d1c?q=80&w=959&auto=format&fit=crop"
                          }
                          size={120}
                          alt={user.name || "Profile"}
                        />
                        <span className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-lg">
                          <FiCamera size={18} />
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setImageFile(file);
                              setPreview(URL.createObjectURL(file));
                            }
                          }}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="submit"
                        className="rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                      >
                        Upload Image
                      </button>
                    </form>
                  </div>

                  <div className={cardClass}>
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                        <FiEdit3 size={18} />
                      </span>
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          Personal Information
                        </p>
                        <p className="text-sm text-slate-500">
                          Keep your visible profile details accurate
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                          <FiUser size={16} />
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) =>
                            setUser({ ...user, name: e.target.value })
                          }
                          placeholder="Name"
                          className={inputClass}
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                          <FiMail size={16} />
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className={`${inputClass} bg-slate-100 text-slate-500`}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        Update Profile
                      </button>
                    </form>
                  </div>

                  <div className={cardClass}>
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <FiLock size={18} />
                      </span>
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          Password and Access
                        </p>
                        <p className="text-sm text-slate-500">
                          Update your password and return to your dashboard
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwords.current}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              current: e.target.value,
                            })
                          }
                          placeholder="Current Password"
                          className={inputClass}
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwords.newPass}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              newPass: e.target.value,
                            })
                          }
                          placeholder="New Password"
                          className={inputClass}
                          required
                        />
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="submit"
                          className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                          Change Password
                        </button>
                        <button
                          type="button"
                          className="rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          onClick={goToDashboard}
                        >
                          Back to Dashboard
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="rounded-[24px] border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-5">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                        <FiCheckCircle size={18} />
                      </span>
                      <div>
                        <p className="text-base font-semibold text-slate-900">
                          Profile Tips
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          Use a clear image, keep your name updated, and change
                          your password regularly for a more secure DocMeet
                          experience.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProfilePage;
