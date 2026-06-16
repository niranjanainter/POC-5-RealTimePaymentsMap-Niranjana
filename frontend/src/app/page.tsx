"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Asynchronously wrap Leaflet container component to prevent SSR compilation shifts or crashes
const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#0B111E] flex items-center justify-center text-slate-400 font-medium">Loading Mapping Canvas Engine...</div>
});

interface RailData {
  id: string;
  name: string;
  region: string;
  country_code: string;
  efficiency: string;
  integrity: string;
  volume_trend: string;
  why_this_matters: string;
  who_controls: string;
  coordinates: [number, number];
  launch_year: string;
}

export default function DashboardPage() {
  const [rails, setRails] = useState<RailData[]>([]);
  const [selectedRail, setSelectedRail] = useState<RailData | null>(null);

  useEffect(() => {
    // Synchronize telemetry records directly from our local FastAPI layer endpoint
    fetch("http://127.0.0.1:8000/api/v1/rails")
      .then((res) => res.json())
      .then((data) => {
        setRails(data);
        if (data.length > 0) setSelectedRail(data[0]); // Default focus on load
      })
      .catch((err) => console.error("Telemetry link synchronization error:", err));
  }, []);

  const handleDownload = () => {
    if (!selectedRail) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedRail, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${selectedRail.id}_metrics_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex h-screen w-full bg-[#0B111E] text-slate-100 font-sans overflow-hidden">
      
      {/* 🌲 STAGE A — THE 70% MAIN WORKSPACE STAGE: GEOSPATIAL MAP (LEFT SIDE) */}
      <div className="w-[70%] h-full relative border-r border-slate-800">
        <MapComponent 
          railsData={rails} 
          activeRail={selectedRail} 
          onMarkerClick={(rail: RailData) => setSelectedRail(rail)} 
        />
        
        {/* ADOPTION FILTERS FEATURE: Floating Navigation layer for camera viewport adjustments */}
        <div className="absolute top-4 left-4 z-[1000] flex space-x-2 bg-[#0F172A]/90 p-1.5 rounded-xl border border-slate-700 backdrop-blur-md shadow-2xl">
          {rails.map((rail) => (
            <button
              key={rail.id}
              onClick={() => setSelectedRail(rail)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedRail?.id === rail.id 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {rail.name}
            </button>
          ))}
        </div>
      </div>

      {/* 🌲 STAGE B — THE 30% CONTROL PANEL STAGE: ANALYTICS SIDEBAR (RIGHT SIDE) */}
      <div className="w-[30%] h-full bg-[#0F172A] p-6 flex flex-col justify-between border-l border-slate-800 shadow-2xl z-10">
        
        <div className="space-y-6 overflow-y-auto pr-1">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-blue-500 font-extrabold">Network Intelligence Workspace</span>
            <h1 className="text-xl font-black text-white mt-0.5">RealRails Control Studio</h1>
          </div>

          {selectedRail ? (
            <div className="space-y-5">
              {/* Header Title Section */}
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-2xl font-black text-white tracking-tight">{selectedRail.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Clearing Network Identifier: <span className="text-slate-200 font-semibold">{selectedRail.id.toUpperCase()}</span></p>
              </div>

              {/* COUNTRY CARDS FEATURE */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-4 shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center font-black text-sm border border-blue-500/30">
                    {selectedRail.country_code}
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Region Anchor Profile</span>
                    <h3 className="text-sm font-bold text-white">{selectedRail.region}</h3>
                  </div>
                </div>
              </div>

              {/* SCHEME METADATA FEATURE — Core Performance Grid */}
              <div className="grid grid-cols-1 gap-2.5">
                <div className="bg-[#1E293B]/60 border border-slate-800 p-3 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Settlement Efficiency</span>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5">{selectedRail.efficiency}</p>
                </div>
                <div className="bg-[#1E293B]/60 border border-slate-800 p-3 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Operation Integrity</span>
                  <p className="text-xs font-bold text-slate-200 mt-0.5">{selectedRail.integrity}</p>
                </div>
                <div className="bg-[#1E293B]/60 border border-slate-800 p-3 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Volume Metric Trend</span>
                  <p className="text-xs font-bold text-blue-400 mt-0.5">{selectedRail.volume_trend}</p>
                </div>
              </div>

              {/* TIMELINE OF LAUNCHES FEATURE */}
              <div className="bg-[#1E293B]/40 border border-slate-800 p-4 rounded-xl">
                <h3 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-3">Timeline of Infrastructure Launches</h3>
                <div className="relative border-l-2 border-slate-700 pl-4 space-y-4 text-xs">
                  <div className="relative">
                    <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full transition-all ${selectedRail.id === 'upi' ? 'bg-blue-500 ring-4 ring-blue-500/20 scale-110' : 'bg-slate-600'}`} />
                    <span className="font-bold text-slate-400">2016</span> — <span className={selectedRail.id === 'upi' ? 'text-white font-bold' : 'text-slate-400'}>UPI Network Launch (India)</span>
                  </div>
                  <div className="relative">
                    <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full transition-all ${selectedRail.id === 'sepa' ? 'bg-blue-500 ring-4 ring-blue-500/20 scale-110' : 'bg-slate-600'}`} />
                    <span className="font-bold text-slate-400">2017</span> — <span className={selectedRail.id === 'sepa' ? 'text-white font-bold' : 'text-slate-400'}>SEPA Instant Deployment (Eurozone)</span>
                  </div>
                  <div className="relative">
                    <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full transition-all ${selectedRail.id === 'fednow' ? 'bg-blue-500 ring-4 ring-blue-500/20 scale-110' : 'bg-slate-600'}`} />
                    <span className="font-bold text-slate-400">2023</span> — <span className={selectedRail.id === 'fednow' ? 'text-white font-bold' : 'text-slate-400'}>FedNow System Go-Live (USA)</span>
                  </div>
                </div>
              </div>

              {/* Strategic Insights Blocks */}
              <div className="bg-[#1E293B] border border-slate-800 p-4 rounded-xl space-y-3.5 shadow-inner">
                <div>
                  <h3 className="text-[10px] font-bold text-blue-400 tracking-wider uppercase">WHY THIS MATTERS</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedRail.why_this_matters}</p>
                </div>
                <div className="border-t border-slate-800 pt-3">
                  <h3 className="text-[10px] font-bold text-blue-400 tracking-wider uppercase">WHO CONTROLS THE RAIL</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedRail.who_controls}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">Select a clearing network hub link to intercept stream data telemetry.</div>
          )}
        </div>

        {/* Download Action Action Button Container */}
        <div className="pt-4 border-t border-slate-800 bg-[#0F172A]">
          <button 
            onClick={handleDownload}
            disabled={!selectedRail}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-lg active:scale-[0.99]"
          >
            Download Sample Data
          </button>
        </div>

      </div>
    </div>
  );
}