import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Eye,
  LayoutDashboard,
  Scan,
  FolderKanban,
  History,
  FileText,
  Settings,
  Sparkles,
} from "lucide-react";

export const NavBar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Overview", icon: Eye },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/analyze", label: "Analyze", icon: Scan, isAction: true },
    { path: "/assets", label: "Assets", icon: FolderKanban },
    { path: "/history", label: "History", icon: History },
    { path: "/reports", label: "Reports", icon: FileText },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f17]/90 backdrop-blur-md border-b border-[#1f293d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-lg font-mono">
                SITESENTINEL
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block tracking-wide">
              Evidence-Grounded Visual Inspection
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(link.path);

            if (link.isAction) {
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 mx-1 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30 font-bold"
                      : "bg-teal-600/90 hover:bg-teal-500 text-white shadow-md shadow-teal-900/30"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>Start Inspection</span>
                </Link>
              );
            }

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-slate-800 text-white font-semibold border border-slate-700"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Demo Case Trigger */}
        <div className="flex items-center gap-3">
          <Link
            to="/analyze?demo=true"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Try Demo Case</span>
            <span className="sm:hidden">Demo</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
