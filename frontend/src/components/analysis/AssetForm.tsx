import React from "react";
import { AssetType, CriticalityLevel, InspectionType } from "@sitesentinel/shared";
import { Shield, MapPin, FileText, GitCompare } from "lucide-react";

export interface AssetFormData {
  asset_id: string;
  asset_name: string;
  asset_type: AssetType;
  asset_criticality: CriticalityLevel;
  inspection_type: InspectionType;
  location_note: string;
  context_notes: string;
  compare_with_previous: boolean;
}

interface AssetFormProps {
  data: AssetFormData;
  onChange: (updated: Partial<AssetFormData>) => void;
}

export const AssetForm: React.FC<AssetFormProps> = ({ data, onChange }) => {
  const assetTypes: { value: AssetType; label: string }[] = [
    { value: "building_facade", label: "Building Facade / Envelope" },
    { value: "bridge", label: "Bridge / Viaduct Pier" },
    { value: "pipeline", label: "Pipeline / Hydrocarbon Conduit" },
    { value: "roof", label: "Commercial / Industrial Roof" },
    { value: "industrial_equipment", label: "Industrial Machinery / Tank" },
    { value: "road_surface", label: "Roadway / Pavement" },
    { value: "utility_structure", label: "Utility / Transmission Tower" },
    { value: "other", label: "Other Infrastructure" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Asset ID */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Asset ID / Code <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={data.asset_id}
            onChange={(e) => onChange({ asset_id: e.target.value })}
            placeholder="e.g., BR-401, PL-022"
            pattern="^[A-Za-z0-9_\-\.]+$"
            className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Re-using an existing asset ID triggers automatic change-aware comparison!
          </p>
        </div>

        {/* Asset Friendly Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Asset Name / Facility
          </label>
          <input
            type="text"
            value={data.asset_name}
            onChange={(e) => onChange({ asset_name: e.target.value })}
            placeholder="e.g., Interstate Viaduct Span 4"
            className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Asset Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Asset Classification
          </label>
          <select
            value={data.asset_type}
            onChange={(e) => onChange({ asset_type: e.target.value as AssetType })}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-500"
          >
            {assetTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Asset Criticality */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Asset Criticality</span>
          </label>
          <select
            value={data.asset_criticality}
            onChange={(e) => onChange({ asset_criticality: e.target.value as CriticalityLevel })}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-500"
          >
            <option value="high">High (Load-bearing / Life Safety)</option>
            <option value="medium">Medium (Standard Operational)</option>
            <option value="low">Low (Non-critical auxiliary)</option>
          </select>
        </div>

        {/* Inspection Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Inspection Protocol
          </label>
          <select
            value={data.inspection_type}
            onChange={(e) => onChange({ inspection_type: e.target.value as InspectionType })}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-500"
          >
            <option value="routine">Routine Scheduled Cycle</option>
            <option value="post_event">Post-Event (Seismic / Storm)</option>
            <option value="follow_up">Targeted Follow-up</option>
          </select>
        </div>
      </div>

      {/* Location Note */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-teal-400" />
          <span>Location / Orientation Specifics (Optional, ≤200 chars)</span>
        </label>
        <input
          type="text"
          maxLength={200}
          value={data.location_note}
          onChange={(e) => onChange({ location_note: e.target.value })}
          placeholder="e.g., South elevation, Pier column 4B, 3 meters above grade"
          className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
        />
      </div>

      {/* Context Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Field Observations / Context (Untrusted Data, ≤1000 chars)</span>
          </span>
          <span className="text-[11px] text-slate-500">{data.context_notes.length}/1000</span>
        </label>
        <textarea
          rows={2}
          maxLength={1000}
          value={data.context_notes}
          onChange={(e) => onChange({ context_notes: e.target.value })}
          placeholder="Notes on recent repairs, weather conditions, or specific suspected anomaly..."
          className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
        />
      </div>

      {/* Compare with Previous Toggle */}
      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.compare_with_previous}
            onChange={(e) => onChange({ compare_with_previous: e.target.checked })}
            className="mt-1 w-4 h-4 rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-teal-500 focus:ring-offset-slate-900 cursor-pointer"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <GitCompare className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-semibold text-white group-hover:text-teal-300 transition-colors">
                Enable Change-Aware Re-Inspection
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Compares findings against prior inspection of this asset to classify defects as{" "}
              <span className="text-amber-400 font-mono">new</span>,{" "}
              <span className="text-red-400 font-mono">worsened</span>, or{" "}
              <span className="text-teal-400 font-mono">improved</span>.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};
