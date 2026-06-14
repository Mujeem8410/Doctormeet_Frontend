import { useState } from "react";
import API from "../utils/api";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [retypeNewPass, setRetypeNewPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showRetypeNewPass, setShowRetypeNewPass] = useState(false);

  const handleSendOtp = async () => {
    try {
      const res = await API.post("/send-forgot-otp", { email });
      toast.success(res.data.message);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (newPass !== retypeNewPass) {
        
        document.querySelector(".msg").classList.remove("hidden");
        setTimeout(() => {
          document.querySelector(".msg").classList.add("hidden");
        }, 3000);
        return;
    }
    try {
      const res = await API.post("/verify-forgot-otp", {
        email,
        otp,
        newPassword: newPass,
      });
      toast.success(res.data.message);
      setStep(3);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Reset Your Password</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your registered email"
            className="w-full border p-2 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOtp} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Send OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full border p-2 mb-3"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <div className="relative mb-4">
            <input
              type={showNewPass ? "text" : "password"}
              placeholder="New Password"
              className="w-full border p-2 pr-12"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowNewPass((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-blue-600"
              aria-label={showNewPass ? "Hide new password" : "Show new password"}
            >
              {showNewPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          <div className="relative mb-4">
            <input
              type={showRetypeNewPass ? "text" : "password"}
              placeholder="Retype new Password"
              className="w-full border p-2 pr-12"
              value={retypeNewPass}
              onChange={(e) => setRetypeNewPass(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowRetypeNewPass((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-blue-600"
              aria-label={showRetypeNewPass ? "Hide retyped password" : "Show retyped password"}
            >
              {showRetypeNewPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          <p className="text-red-600 hidden msg mb-2">Please Enter same Password</p>
          <button onClick={handleVerifyOtp} className="bg-green-600 text-white px-4 py-2 rounded w-full">
            Reset Password
          </button>
        </>
      )}

      {step === 3 && <p className="text-green-600 text-center">Password reset successful! Redirecting...</p>}
    </div>
  );
};

export default ForgotPassword;
