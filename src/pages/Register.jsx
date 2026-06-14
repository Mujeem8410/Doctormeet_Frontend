import { useState } from "react";
import Navbar from "../AuPublic/Navbar";
import { toast } from "react-toastify";
import API from "../utils/api";
import DoctorAvailabilityForm from "./DoctorAvailabilityForm";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "patient",
    specialization: "",
    clinicName: "",
    clinicAddress: "",
    city: "",
    pincode: "",
    phone: "",
    experience: "",
    qualification: "",
    consultationFee: 500,
  });

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [availability, setAvailability] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[15px] text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100";
  const sectionClass = "rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvailabilitySave = (availabilityData) => {
    setAvailability(availabilityData);
    toast.success("Availability saved successfully!");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.role === "doctor") {
      if (availability.length === 0) {
        toast.error("Please set your availability times");
        return;
      }
      if (
        !formData.clinicName ||
        !formData.clinicAddress ||
        !formData.city ||
        !formData.pincode
      ) {
        toast.error("Please fill all clinic details");
        return;
      }
    }

    try {
      const registrationData = {
        ...formData,
        ...(formData.role === "doctor" && {
          availability,
          consultationFee: Number(formData.consultationFee) || 500,
        }),
      };

      const res = await API.post("/register", registrationData);
      if (res.status === 200) {
        toast.success("OTP sent to your email");
        setStep(2);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const verificationData = {
        email: formData.email,
        otp,
        name: formData.name,
        mobile: formData.mobile,
        password: formData.password,
        role: formData.role,
        specialization: formData.specialization,
        availability: formData.role === "doctor" ? availability : [],
        ...(formData.role === "doctor" && {
          clinicName: formData.clinicName,
          clinicAddress: formData.clinicAddress,
          city: formData.city,
          pincode: formData.pincode,
          phone: formData.phone,
          experience: formData.experience,
          qualification: formData.qualification,
          consultationFee: Number(formData.consultationFee) || 500,
        }),
      };

      const res = await API.post("/verifyOTP", verificationData);

      if (res.status === 201) {
        toast.success("Account created successfully");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-4 pb-8 pt-20 sm:px-5 lg:px-6 mt-4">
        <div className="mx-auto max-w-[58rem]">
          <div className="overflow-hidden rounded-[22px] border border-white/60 bg-white/90 shadow-2xl backdrop-blur">
            <div className="grid lg:grid-cols-[0.86fr_1.14fr]">
              <div className="bg-gradient-to-br from-sky-700 via-blue-600 to-cyan-500 p-5 text-white lg:p-6">
                <div className="mb-4 inline-flex rounded-full bg-white/15 px-3.5 py-1 text-[11px] font-semibold">
                  DocMeet Access
                </div>
                <h2 className="text-[1.75rem] font-bold leading-tight lg:text-[1.9rem]">
                  {step === 1 ? "Create your account" : "Verify your OTP"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-blue-50">
                  {step === 1
                    ? "Join as a patient or doctor with a cleaner registration flow and a more polished form experience."
                    : "One last step. Enter the code sent to your email to activate your account."}
                </p>

                <div className="mt-5 space-y-2.5">
                  <div
                    className={`rounded-xl border px-3.5 py-2.5 ${
                      step === 1
                        ? "border-white/40 bg-white/20"
                        : "border-white/15 bg-white/10"
                    }`}
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-blue-100">
                      Step 1
                    </p>
                    <p className="mt-1 text-sm font-semibold">Registration Details</p>
                  </div>
                  <div
                    className={`rounded-xl border px-3.5 py-2.5 ${
                      step === 2
                        ? "border-white/40 bg-white/20"
                        : "border-white/15 bg-white/10"
                    }`}
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-blue-100">
                      Step 2
                    </p>
                    <p className="mt-1 text-sm font-semibold">Email Verification</p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 lg:p-6">
                {step === 1 && (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 sm:text-xl">
                        Register
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Fill in your details to get started with DocMeet.
                      </p>
                    </div>

                  <div className={sectionClass}>
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Basic Information
                      </h4>
                      <div className="grid gap-3.5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Full Name
                          </label>
                          <input
                            name="name"
                            value={formData.name}
                            placeholder="Enter your full name"
                            onChange={handleChange}
                            className={inputClass}
                            required
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Email
                          </label>
                          <input
                            name="email"
                            type="email"
                            value={formData.email}
                            placeholder="Enter your email"
                            onChange={handleChange}
                            className={inputClass}
                            required
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Mobile Number
                          </label>
                          <input
                            name="mobile"
                            value={formData.mobile}
                            placeholder="Enter mobile number"
                            onChange={handleChange}
                            className={inputClass}
                            required
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Role
                          </label>
                          <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={inputClass}
                            required
                          >
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              name="password"
                              placeholder="Create a secure password"
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={handleChange}
                              className={`${inputClass} pr-12`}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-blue-600"
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? (
                                <FiEyeOff size={18} />
                              ) : (
                                <FiEye size={18} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {formData.role === "doctor" && (
                      <>
                        <div className={sectionClass}>
                          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Professional Details
                          </h4>
                          <div className="grid gap-3.5 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Specialization
                              </label>
                              <input
                                type="text"
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="e.g. Cardiologist"
                                required
                              />
                            </div>

                            <div>
                              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Qualification
                              </label>
                              <input
                                type="text"
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="e.g. MBBS, MD"
                                required
                              />
                            </div>

                            <div>
                              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Experience
                              </label>
                              <input
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="e.g. 5 years"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className={sectionClass}>
                          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Clinic Details
                          </h4>
                          <div className="grid gap-3.5 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Clinic or Hospital Name
                              </label>
                              <input
                                type="text"
                                name="clinicName"
                                value={formData.clinicName}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Clinic/Hospital Name"
                                required
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Clinic Address
                              </label>
                              <textarea
                                name="clinicAddress"
                                value={formData.clinicAddress}
                                onChange={handleChange}
                                className={`${inputClass} min-h-[110px] resize-none`}
                                placeholder="Full clinic address"
                                rows="3"
                                required
                              />
                            </div>

                            <div>
                              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                City
                              </label>
                              <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="City"
                                required
                              />
                            </div>

                            <div>
                              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Pincode
                              </label>
                              <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Pincode"
                                required
                              />
                            </div>

                            <div>
                              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Clinic Phone Number
                              </label>
                              <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Clinic phone number"
                                required
                              />
                            </div>

                            <div>
                              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Consultation Fee
                              </label>
                              <input
                                type="number"
                                name="consultationFee"
                                value={formData.consultationFee}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Consultation fee"
                                min="0"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className={sectionClass}>
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Clinic Availability
                              </h4>
                              <p className="mt-1 text-sm text-slate-500">
                                Add the slots where patients can book you.
                              </p>
                            </div>

                            {availability.length > 0 && (
                              <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                {availability.length} slot(s) saved
                              </div>
                            )}
                          </div>

                          <DoctorAvailabilityForm onSave={handleAvailabilitySave} />

                          {availability.length > 0 && (
                            <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-3.5">
                              <h3 className="mb-2.5 font-semibold text-blue-800">
                                Availability Preview
                              </h3>
                              <div className="space-y-2 text-sm text-blue-700">
                                {availability.map((slot, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between rounded-xl bg-white px-3 py-2"
                                  >
                                    <span className="font-medium">
                                      {slot.day}
                                    </span>
                                    <span>
                                      {slot.startTime} - {slot.endTime}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition duration-200 hover:bg-blue-700"
                    >
                      Continue Registration
                    </button>
                  </form>
                )}

                {step === 2 && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 sm:text-xl">
                        Verify OTP
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Enter the OTP sent to <strong>{formData.email}</strong>
                      </p>
                    </div>

                    <div className={sectionClass}>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        One-Time Password
                      </label>
                      <input
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className={`${inputClass} text-center text-lg tracking-[0.45em]`}
                        maxLength={6}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-200 transition duration-200 hover:bg-green-700"
                    >
                      Verify OTP
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
