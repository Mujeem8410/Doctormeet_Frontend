import React, { useState } from "react";
import { toast } from "react-toastify";
import { FiAlertTriangle, FiMapPin, FiPhone, FiX } from "react-icons/fi";
import API from "../utils/api";

const PLATFORM_HELPLINE = "8410140108";

const EmergencyTriageModal = () => {
  const [locationStatus, setLocationStatus] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const closeModal = () => {
    document.getElementById("emergency-modal").classList.add("hidden");
    setLocationStatus(null);
    setIsFetching(false);
  };

  const sendEmergencyAlert = async (lat, lon) => {
    setIsFetching(true);
    const type = "UrgentHelpNeeded";

    try {
      await API.post("/emergency/alert", {
        type,
        latitude: lat,
        longitude: lon,
      });

      toast.success("Help alert sent. Our team received your request.", {
        autoClose: 5000,
      });
    } catch (error) {
      toast.error("Failed to send alert. Please call manually.", {
        autoClose: 8000,
      });
      console.error("Emergency Alert Error:", error);
    } finally {
      setIsFetching(false);
      closeModal();

      if (
        window.confirm(
          `Your digital alert is sent. Now, please call the DocMeet Helpline at ${PLATFORM_HELPLINE} to speak to an assistant.`
        )
      ) {
        window.location.href = `tel:${PLATFORM_HELPLINE}`;
      }
    }
  };

  const getLocationAndAlert = () => {
    if (navigator.geolocation) {
      setLocationStatus("Please approve the location sharing request...");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLocationStatus("Location found. Sending your help request...");
          sendEmergencyAlert(lat, lon);
        },
        (error) => {
          setLocationStatus(
            "Location access failed. Sending the alert without precise coordinates."
          );
          console.error("Geolocation Error:", error);
          sendEmergencyAlert(null, null);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      setLocationStatus("Geolocation is not supported by this browser.");
      sendEmergencyAlert(null, null);
    }
  };

  const handleSendHelp = () => {
    getLocationAndAlert();
  };

  return (
    <div
      id="emergency-modal"
      className="fixed inset-0 z-50 hidden bg-slate-950/65 px-4 backdrop-blur-sm"
    >
      <div className="flex min-h-screen items-center justify-center py-8">
        <div className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 px-5 py-5 text-white sm:px-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
              <FiAlertTriangle size={14} />
              Urgent Support
            </div>
            <h3 className="text-2xl font-bold sm:text-[1.7rem]">
              Emergency Help Request
            </h3>
            <p className="mt-2 max-w-lg text-sm leading-6 text-red-50">
              Send a high-priority alert to the DocMeet dispatch system with
              your current location so the team can respond faster.
            </p>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
                  Step 1
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  Share your location
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  We use your location only to help route urgent support.
                </p>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
                  Step 2
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  Call the helpline
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  After the alert is sent, call for immediate human assistance.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <FiMapPin size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Send alert with live location
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    This sends an urgent help request to DocMeet. If location
                    permission fails, we still send the alert without exact
                    coordinates.
                  </p>
                </div>
              </div>

              <button
                onClick={handleSendHelp}
                disabled={isFetching}
                className="mt-4 w-full rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:from-red-700 hover:to-rose-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isFetching
                  ? "Sending alert and fetching location..."
                  : "Send Alert and My Location"}
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <FiPhone size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Direct Helpline
                  </p>
                  <p className="text-base font-bold text-red-600">
                    {PLATFORM_HELPLINE}
                  </p>
                </div>
              </div>
            </div>

            {locationStatus && (
              <div
                className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                  locationStatus.toLowerCase().includes("failed")
                    ? "border border-red-200 bg-red-50 text-red-600"
                    : "border border-blue-200 bg-blue-50 text-blue-700"
                }`}
              >
                {locationStatus}
              </div>
            )}
          </div>

          <button
            onClick={closeModal}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            aria-label="Close emergency help modal"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyTriageModal;
