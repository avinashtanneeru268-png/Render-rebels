import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto py-16 text-center space-y-4">
      <div className="field-panel p-8 space-y-4">
        <AlertCircle className="w-12 h-12 text-teal-400 mx-auto" />
        <h1 className="text-3xl font-mono font-black text-white">404</h1>
        <p className="text-sm text-slate-300">
          The requested inspection view or asset endpoint does not exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Safety (Home)</span>
        </Link>
      </div>
    </div>
  );
};
