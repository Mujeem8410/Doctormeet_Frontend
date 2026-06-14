import React from "react";

const LoadingState = ({
  message = "Loading...",
  overlay = false,
  compact = false,
}) => {
  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-4 rounded-[24px] border border-white/60 bg-white/90 px-6 py-8 shadow-2xl backdrop-blur-xl ${
        compact ? "min-h-[180px]" : "min-h-[260px]"
      }`}
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        <div className="absolute h-14 w-14 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 shadow-lg shadow-blue-200" />
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-slate-800">{message}</p>
        <p className="mt-1 text-sm text-slate-500">
          Please wait while we prepare your data.
        </p>
      </div>
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingState;
