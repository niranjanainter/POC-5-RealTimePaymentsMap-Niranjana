"use client";

import React, { useEffect, useState } from "react";
import { Globe, Shield, Activity, RefreshCw, Layers } from "lucide-react";

interface Metric {
  settlement_speed: string;
  availability: string;
  volume_growth_trend: string;
}

interface PaymentSystem {
  id: string;
  country: string;
  scheme_name: string;
  operator: string;
  launch_year: number;
  status: string;
  coverage: string;
  latitude: number;
  longitude: number;
  metrics: Metric;
  insight_summary: string;
}

export default function Home() {
  const [data, setData] = useState<{ total_active_systems: number; systems: PaymentSystem[] } | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<PaymentSystem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/rails")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to pull data from backend engine");
        return res.json();
      })
      .then((data) => {
        setData(data);
        if (data.systems && data.systems.length > 0) {
          setSelectedSystem(data.systems[0]); // Default to first system
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B111E] text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm font-medium tracking-wide">Syncing Real Rails Engine Context...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B111E] text-rose-400 p-6">
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 max-w-md text-center">
          <p className="font-semibold mb-2">Backend Connection Error</p>
          <p className="text-sm text-rose-300/80 mb-4">{error}</p>
          <p className="text-xs text-slate-400">Make sure your FastAPI server is running on port 8000!</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-screen w-screen bg-[#0B111E] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar - Navigation & Global Counters */}
      <section className="w-80 border-r border-slate-800 bg-[#0F172A]/60 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-8">
            <Globe className="h-6 w-6 text-blue-500" />
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              RealRails Analytics
            </h1>
          </div>

          <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/5 border border-blue-500/20 rounded-xl p-5 mb-6">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">Active Core Systems</p>
            <p className="text-4xl font-extrabold text-white tracking-tight">{data?.total_active_systems}</p>
          </div>

          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Infrastructure Monitored</h2>
          <div className="space-y-1">
            {data?.systems.map((system) => (
              <button
                key={system.id}
                onClick={() => setSelectedSystem(system)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex flex-col gap-0.5 ${
                  selectedSystem?.id === system.id
                    ? "bg-blue-600/10 border border-blue-500/30 text-white font-medium"
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent"
                }`}
              >
                <span>{system.scheme_name}</span>
                <span className="text-xs opacity-60 font-light">{system.country}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-4 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Gateway Online</span>
          </div>
          <span>v1.0.0</span>
        </div>
      </section>

      {/* Main Workspace Dashboard Grid */}
      <section className="flex-1 flex flex-col overflow-hidden">
        {/* Mock Map / Coordinate View Header Area */}
        <div className="flex-1 bg-[#090D16] relative flex items-center justify-center border-b border-slate-800/60 p-6">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="text-center max-w-xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300 mb-4">
              <Layers className="h-3.5 w-3.5 text-blue-400" />
              <span>Map Anchor Coordinate Focus</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white mb-2">{selectedSystem?.scheme_name}</h3>
            <p className="text-sm text-slate-400 mb-4">{selectedSystem?.insight_summary}</p>
            <div className="font-mono text-xs text-slate-500 bg-slate-950/40 border border-slate-800/80 px-4 py-2 rounded-lg inline-block">
              LAT: {selectedSystem?.latitude} / LON: {selectedSystem?.longitude}
            </div>
          </div>
        </div>

        {/* Telemetry Metrics Footer Panel */}
        <div className="bg-[#0F172A]/40 border-t border-slate-800 p-6 grid grid-cols-3 gap-6">
          <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl flex items-start gap-3">
            <Activity className="h-5 w-5 text-indigo-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">Settlement Efficiency</p>
              <p className="text-base font-semibold text-white">{selectedSystem?.metrics.settlement_speed}</p>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl flex items-start gap-3">
            <Shield className="h-5 w-5 text-emerald-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">Operation Integrity</p>
              <p className="text-base font-semibold text-white">{selectedSystem?.metrics.availability}</p>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl flex items-start gap-3">
            <RefreshCw className="h-5 w-5 text-sky-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">Volume Metric Trend</p>
              <p className="text-base font-semibold text-white">{selectedSystem?.metrics.volume_growth_trend}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}