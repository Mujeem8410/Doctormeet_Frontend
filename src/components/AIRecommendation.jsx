import React, { useState } from "react";
import { FiActivity, FiArrowRight, FiZap } from "react-icons/fi";
import API from "../utils/api";
import { toast } from "react-toastify";

const AIRecommendation = ({ onDoctorsFound }) => {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRecommendation = async () => {
    if (!symptoms.trim()) {
      toast.error("Please describe your symptoms");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/chat/ai-recommendation", { symptoms });

      setResult(res.data);
      onDoctorsFound(res.data.recommendedDoctors);

      toast.success(
        `Found ${res.data.symptomsCount} ${res.data.specialization} doctors`
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to get recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 overflow-hidden rounded-[24px] border border-white/60 bg-white/90 shadow-xl backdrop-blur-xl">
      <div className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 px-5 py-5 text-white">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
          <FiZap size={14} />
          Smart Recommendation
        </div>
        <h3 className="text-xl font-bold sm:text-2xl">
          Find the right doctor with AI
        </h3>
        <p className="mt-2 text-sm leading-6 text-emerald-50">
          Describe your symptoms and let DocMeet suggest the most relevant
          specialists for your case.
        </p>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Describe your symptoms
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Example: I have fever, headache, cough, and chest discomfort for 3 days..."
            className="min-h-[110px] w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            rows="3"
          />
          <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <FiActivity size={13} />
            Be specific for better specialist recommendations
          </p>
        </div>

        <button
          onClick={handleRecommendation}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Analyzing Symptoms...
            </>
          ) : (
            <>
              Find Right Doctor
              <FiArrowRight size={16} />
            </>
          )}
        </button>

        {result && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                <FiZap size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Recommended specialist:
                  <span className="ml-2 capitalize text-blue-600">
                    {result.specialization}
                  </span>
                </p>
                <p className="mt-1 text-sm text-slate-600">{result.reason}</p>
                <p className="mt-2 text-sm font-medium text-emerald-700">
                  Found {result.symptomsCount} doctors matching your needs
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendation;
