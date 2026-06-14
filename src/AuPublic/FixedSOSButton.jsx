import React from "react";
import { FiAlertTriangle, FiPhoneCall } from "react-icons/fi";

const FixedSOSButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-red-200 bg-white/95 px-4 py-3 text-left shadow-2xl shadow-red-200/60 backdrop-blur transition hover:-translate-y-0.5 hover:border-red-300 hover:shadow-red-300/60 sm:bottom-6 sm:right-6"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-700 text-white shadow-lg shadow-red-300/60">
        <FiAlertTriangle size={20} />
      </span>
      <span className="flex flex-col">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-500">
          Emergency
        </span>
        <span className="text-sm font-bold text-slate-900">SOS Help</span>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <FiPhoneCall size={12} />
          Get urgent support
        </span>
      </span>
    </button>
  );
};

export default FixedSOSButton;
