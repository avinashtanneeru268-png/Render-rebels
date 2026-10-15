import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../services/api";
import { AssetForm, AssetFormData } from "../components/analysis/AssetForm";
import { Dropzone } from "../components/analysis/Dropzone";
import { CameraCapture } from "../components/analysis/CameraCapture";
import { DemoCaseSelector } from "../components/analysis/DemoCaseSelector";
import { AnalysisProgress } from "../components/analysis/AnalysisProgress";
import {
  UploadCloud,
  Camera,
  Sparkles,
  Scan,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export const AnalyzePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<"upload" | "camera" | "demo">(
    searchParams.get("demo") === "true" ? "demo" : "upload"
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<AssetFormData>({
    asset_id: "BR-401",
    asset_name: "Interstate Viaduct Span 4",
    asset_type: "bridge",
    asset_criticality: "high",
    inspection_type: "routine",
    location_note: "South Pier face",
    context_notes: "",
    compare_with_previous: true,
  });

  const [runningAnalysisId, setRunningAnalysisId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Demo Cases query
  const { data: demoCases } = useQuery({
    queryKey: ["demoCases"],
    queryFn: api.getDemoCases,
  });

  // Run Demo Case mutation
  const runDemoMutation = useMutation({
    mutationFn: (caseId: string) => api.runDemoCase(caseId),
    onSuccess: (data) => {
      navigate(`/results/${data.analysisId}`);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Failed to execute simulated demo case.");
    },
  });

  // Submit real inspection mutation
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error("Please select an image or video file.");
      const fd = new FormData();
      fd.append("file", selectedFile);
      fd.append("asset_id", formData.asset_id);
      fd.append("asset_name", formData.asset_name);
      fd.append("asset_type", formData.asset_type);
      fd.append("asset_criticality", formData.asset_criticality);
      fd.append("inspection_type", formData.inspection_type);
      fd.append("location_note", formData.location_note);
      fd.append("context_notes", formData.context_notes);
      fd.append("compare_with_previous", String(formData.compare_with_previous));
      fd.append("source", activeTab === "camera" ? "camera" : "upload");

      return await api.submitAnalysis(fd);
    },
    onSuccess: (data) => {
      setRunningAnalysisId(data.analysisId);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Failed to submit inspection analysis.");
    },
  });

  // Poll analysis status while running
  const { data: currentJob } = useQuery({
    queryKey: ["pollAnalysis", runningAnalysisId],
    queryFn: () => api.getAnalysisById(runningAnalysisId!),
    enabled: Boolean(runningAnalysisId),
    refetchInterval: 1500,
  });

  useEffect(() => {
    if (currentJob?.status === "completed") {
      navigate(`/results/${currentJob.id}`);
    } else if (currentJob?.status === "failed") {
      setErrorMsg(currentJob.error_message || "Analysis failed during processing.");
      setRunningAnalysisId(null);
    }
  }, [currentJob, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!selectedFile) {
      setErrorMsg("Please upload a file or take a camera photo first.");
      return;
    }
    uploadMutation.mutate();
  };

  if (runningAnalysisId) {
    return (
      <div className="py-12">
        <AnalysisProgress
          stage={currentJob?.progress_stage || "Analyzing"}
          status={currentJob?.status || "processing"}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <Scan className="w-6 h-6 text-teal-400" />
          <span>New Asset Inspection</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Submit field photos or short video frames for automated visual defect identification, change comparison, and advisory actions.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="font-bold">Submission Notice</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Input Mode Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex-1 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeTab === "upload"
              ? "bg-teal-600 text-white shadow-md shadow-teal-900/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload File</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("camera")}
          className={`flex-1 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeTab === "camera"
              ? "bg-teal-600 text-white shadow-md shadow-teal-900/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Live Camera</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("demo")}
          className={`flex-1 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeTab === "demo"
              ? "bg-amber-600 text-white shadow-md shadow-amber-900/30"
              : "text-amber-400/90 hover:text-amber-300"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Demo Case (Offline)</span>
        </button>
      </div>

      {/* Main Workspace Body */}
      {activeTab === "demo" ? (
        <DemoCaseSelector
          cases={demoCases || []}
          onSelectCase={(id) => runDemoMutation.mutate(id)}
          isRunningId={runDemoMutation.isPending ? "loading" : null}
        />
      ) : (
        <form onSubmit={handleSubmit} className="field-panel p-6 space-y-6">
          {/* File Input Area */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              1. Visual Evidence Input
            </h3>
            {activeTab === "camera" ? (
              <CameraCapture
                onCapture={(file) => {
                  setSelectedFile(file);
                  setActiveTab("upload"); // switch to show selected preview
                }}
                onCancel={() => setActiveTab("upload")}
              />
            ) : (
              <Dropzone onFileSelect={setSelectedFile} selectedFile={selectedFile} />
            )}
          </div>

          {/* Asset Metadata Form */}
          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
              2. Asset Classification & Context
            </h3>
            <AssetForm
              data={formData}
              onChange={(updated) => setFormData((prev) => ({ ...prev, ...updated }))}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              {formData.compare_with_previous
                ? "Will auto-link previous baseline if asset ID matches."
                : "Single snapshot triage without baseline comparison."}
            </p>
            <button
              type="submit"
              disabled={uploadMutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-xl shadow-teal-500/20 transition-all"
            >
              <span>{uploadMutation.isPending ? "Uploading..." : "Run Inspection AI"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
