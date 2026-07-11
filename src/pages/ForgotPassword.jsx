import { useEffect, useState } from "react";
import API from "../utils/api";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {
  isValidPassword,
  PASSWORD_POLICY_MESSAGE,
  sanitizeOtp,
} from "../utils/authValidation";

const OTP_RESEND_SECONDS = 180;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [retypeNewPass, setRetypeNewPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showRetypeNewPass, setShowRetypeNewPass] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  useEffect(() => {
    if (resendCountdown <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCountdown]);

  const formatCountdown = (seconds) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const remainingSeconds = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  };

  const handleSendOtp = async () => {
    try {
      setIsSendingOtp(true);
      const res = await API.post("/send-forgot-otp", { email });
      toast.success(res.data.message);
      setStep(2);
      setResendCountdown(res.data.resendAfter || OTP_RESEND_SECONDS);
    } catch (err) {
      const resendAfter = err.response?.data?.resendAfter;
      if (resendAfter) {
        setStep(2);
        setResendCountdown(resendAfter);
      }
      toast.error(err.userMessage || err.response?.data?.message || "Error sending OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }
    
    if (!/^\d{6}$/.test(otp)) {
      toast.error("OTP must be exactly 6 digits.");
      return;
    }
    
    if (!newPass) {
      toast.error("Please enter new password");
      return;
    }
    
    if (!retypeNewPass) {
      toast.error("Please confirm new password");
      return;
    }
    
    if (newPass !== retypeNewPass) {
      toast.error("Passwords do not match. Please enter the same password in both fields.");
      return;
    }
    
    if (!isValidPassword(newPass)) {
      toast.error(PASSWORD_POLICY_MESSAGE);
      return;
    }
    try {
      setIsResettingPassword(true);
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
      toast.error(err.userMessage || err.response?.data?.message || "OTP verification failed");
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResendingOtp(true);
      const res = await API.post("/resend-forgot-otp", { email });
      toast.success(res.data.message || "OTP resent to your email");
      setResendCountdown(res.data.resendAfter || OTP_RESEND_SECONDS);
    } catch (err) {
      const resendAfter = err.response?.data?.resendAfter;
      if (resendAfter) {
        setResendCountdown(resendAfter);
      }
      toast.error(err.userMessage || err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResendingOtp(false);
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
          <button
            onClick={handleSendOtp}
            disabled={isSendingOtp}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-60"
          >
            {isSendingOtp ? "Sending OTP..." : "Send OTP"}
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
            onChange={(e) => setOtp(sanitizeOtp(e.target.value))}
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            autoComplete="one-time-code"
          />
          <div className="mb-3 flex items-center justify-between gap-3 text-sm">
            <span className="text-slate-500">OTP expires in 3 minutes.</span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCountdown > 0 || isResendingOtp}
              className="font-semibold text-blue-600 transition hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              {isResendingOtp
                ? "Resending..."
                : resendCountdown > 0
                ? `Resend in ${formatCountdown(resendCountdown)}`
                : "Resend OTP"}
            </button>
          </div>
          <div className="relative mb-4">
            <input
              type={showNewPass ? "text" : "password"}
              placeholder="New Password"
              className="w-full border p-2 pr-12"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              minLength={8}
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
          <p className="mb-3 text-xs text-slate-500">
            Use 8+ characters with uppercase, lowercase, number, and special character.
          </p>
          <div className="relative mb-4">
            <input
              type={showRetypeNewPass ? "text" : "password"}
              placeholder="Retype new Password"
              className="w-full border p-2 pr-12"
              value={retypeNewPass}
              onChange={(e) => setRetypeNewPass(e.target.value)}
              minLength={8}
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
          <button
            onClick={handleVerifyOtp}
            disabled={isResettingPassword}
            className="bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-60"
          >
            {isResettingPassword ? "Resetting Password..." : "Reset Password"}
          </button>
        </>
      )}

      {step === 3 && <p className="text-green-600 text-center">Password reset successful! Redirecting...</p>}
    </div>
  );
};

export default ForgotPassword;
