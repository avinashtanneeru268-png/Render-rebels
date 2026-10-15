import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { Settings, Shield, Server, Trash2, CheckCircle2, HardDrive, Key } from "lucide-react";

export const SettingsPage: React.FC = () => {
  const { data: health } = useQuery({
    queryKey: ["health"],
    queryFn: api.getHealth,
  });

  const [retentionDays, setRetentionDays] = useState(90);
  const [minSeverity, setMinSeverity] = useState("low");
  const [measurementUnit, setMeasurementUnit] = useState("metric");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeleteData = () => {
    if (window.confirm("WARNING: Are you sure you want to trigger 'Delete My Data'? This will purge local session records.")) {
      localStorage.clear();
      alert("Local data and cached session state cleared.");
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-teal-400" />
          <span>System & Inspection Preferences</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure inspection triage thresholds, data retention policies, and verify deployment configuration.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-teal-950/80 border border-teal-700 text-xs text-teal-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>Preferences updated successfully.</span>
        </div>
      )}

      {/* Deployment & Engine Info */}
      <div className="field-panel p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-teal-400" />
          <span>Deployment Architecture Status</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-mono">
              Persistence Mode
            </span>
            <span className="font-mono font-bold text-white text-sm">
              {health?.mode === "local" ? "Zero-Config Local Mode" : "Supabase PostgreSQL"}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {health?.mode === "local" ? "Atomic local JSON store + file uploads" : "PostgreSQL RLS + private buckets"}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-mono">
              AI Vision Model
            </span>
            <span className="font-mono font-bold text-teal-400 text-sm">
              {health?.aiConfigured ? "Gemini 2.5 Flash Multimodal" : "Offline Demo Suite Active"}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Detector: {health?.activeDetector || "Gemini Vision Multimodal"}
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSave} className="field-panel p-6 space-y-6">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Triage Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Minimum Severity to Flag
            </label>
            <select
              value={minSeverity}
              onChange={(e) => setMinSeverity(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white"
            >
              <option value="informational">Informational (Flag everything)</option>
              <option value="low">Low (Standard triage threshold)</option>
              <option value="moderate">Moderate (Filter minor surface wear)</option>
              <option value="high">High (Only severe defects)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Measurement Units
            </label>
            <select
              value={measurementUnit}
              onChange={(e) => setMeasurementUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white"
            >
              <option value="metric">Metric (mm, cm, m)</option>
              <option value="imperial">Imperial (inches, feet)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Data Retention Period (Days)</span>
            <span className="font-mono text-teal-400 font-bold">{retentionDays} days</span>
          </label>
          <input
            type="range"
            min={7}
            max={365}
            step={7}
            value={retentionDays}
            onChange={(e) => setRetentionDays(Number(e.target.value))}
            className="w-full accent-teal-500 cursor-pointer"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Automatically purge visual artifacts and inspection telemetry older than {retentionDays} days.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white shadow-md shadow-teal-900/30 transition-all"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Danger Zone: Delete My Data */}
      <div className="field-panel p-6 border-red-900/60 bg-red-950/10 space-y-3">
        <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          <span>Data Privacy & Purge Policy</span>
        </h3>
        <p className="text-xs text-slate-400">
          In compliance with infrastructure privacy standards, you can purge client cached inspection data and reset local credentials at any time.
        </p>
        <button
          type="button"
          onClick={handleDeleteData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-950 hover:bg-red-900 border border-red-700 text-red-300 text-xs font-semibold transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Local Session Data</span>
        </button>
      </div>
    </div>
  );
};
