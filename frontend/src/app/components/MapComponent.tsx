"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet marker icon paths in Next.js framework environment
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface PaymentSystem {
  id: string;
  country: string;
  scheme_name: string;
  latitude: number;
  longitude: number;
  insight_summary: string;
}

interface MapProps {
  systems: PaymentSystem[];
  selectedSystem: PaymentSystem | null;
}

// Custom updater component to smoothly slide the map camera when the user clicks a sidebar rail node
function MapRecenter({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) {
      map.setView([lat, lon], 4, { animate: true });
    }
  }, [lat, lon, map]);
  return null;
}

export default function MapComponent({ systems, selectedSystem }: MapProps) {
  // Default map anchor point handles global visibility overview
  const defaultLat = selectedSystem ? selectedSystem.latitude : 20.0;
  const defaultLon = selectedSystem ? selectedSystem.longitude : 0.0;

  return (
    <div className="w-full h-full min-h-[400px] bg-[#090D16] rounded-xl overflow-hidden border border-slate-800/80 relative z-0">
      <MapContainer
        center={[defaultLat, defaultLon]}
        zoom={3}
        className="w-full h-full"
        zoomControl={true}
      >
        {/* Sleek, dark-themed base map layer fitting premium fintech platforms */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {systems.map((system) => (
          <Marker
            key={system.id}
            position={[system.latitude, system.longitude]}
            icon={customIcon}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 text-slate-900">
                <h4 className="font-bold text-sm border-b pb-1 mb-1">{system.scheme_name}</h4>
                <p className="text-xs text-slate-600 font-medium mb-1">{system.country}</p>
                <p className="text-xs leading-relaxed">{system.insight_summary}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {selectedSystem && (
          <MapRecenter lat={selectedSystem.latitude} lon={selectedSystem.longitude} />
        )}
      </MapContainer>
    </div>
  );
}