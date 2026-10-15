import React from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";
import { ModeBanner } from "./ModeBanner";
import { STANDING_ADVISORY_DISCLAIMER } from "@sitesentinel/shared";

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-100 field-grid">
      <ModeBanner />
      <NavBar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="mt-auto border-t border-[#1f293d] bg-[#080c14]/90 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-slate-400">SITESENTINEL</span>
            <span>•</span>
            <span>Infrastructure & Facility Visual Inspection Intelligence</span>
          </div>
          <div className="text-center md:text-right text-[11px] text-slate-500 max-w-xl">
            {STANDING_ADVISORY_DISCLAIMER}
          </div>
        </div>
      </footer>
    </div>
  );
};
