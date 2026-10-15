import React from "react";
import { CheckCircle2, Loader2, Clock } from "lucide-react";

interface AnalysisProgressProps {
  stage?: string; // 'Uploading' | 'Preprocessing' | 'Analyzing' | 'Comparing' | 'Finalizing' | 'Completed'
  status?: string;
  isSimulated?: boolean;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  stage = "Analyzing",
  status = "processing",
  isSimulated = false,
}) => {
  const stages = [
    { key: "Uploading", label: "Media Upload" },
    { key: "Preprocessing", label: "Preprocessing & Frames" },
    { key: "Analyzing", label: "Gemini Visual Understanding" },
    { key: "Comparing", label: "Change-Aware Re-Inspection" },
    { key: "Finalizing", label: "Advisory & Priority Scoring" },
  ];

  const stageOrder = ["Uploading", "Preprocessing", "Analyzing", "Comparing", "Finalizing", "Completed"];
  const currentIdx = stageOrder.indexOf(stage);

  return (
    <div className="field-panel p-6 border-teal-500/30 bg-slate-900/90 max-w-2xl mx-auto shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
            <span>Inspection Analysis in Progress</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isSimulated ? "Loading precomputed inspection dataset" : "Executing multi-stage multimodal understanding pipeline"}
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-teal-950 text-teal-400 border border-teal-800">
          Stage: {stage}
        </span>
      </div>

      <div className="space-y-4">
        {stages.map((s, idx) => {
          const isDone = currentIdx > idx || stage === "Completed";
          const isCurrent = currentIdx === idx && stage !== "Completed";
          const isPending = currentIdx < idx;

          return (
            <div
              key={s.key}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                isCurrent
                  ? "bg-teal-950/40 border-teal-500/50 text-white"
                  : isDone
                  ? "bg-slate-900/60 border-slate-800 text-slate-300"
                  : "bg-slate-900/20 border-slate-800/40 text-slate-500"
              }`}
            >
              <div className="flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
                ) : (
                  <Clock className="w-5 h-5 text-slate-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{s.label}</p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {isDone ? "Completed" : isCurrent ? "Processing..." : "Queued"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
