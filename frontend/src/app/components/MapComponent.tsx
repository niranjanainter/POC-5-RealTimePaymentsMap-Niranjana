"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Reset default Leaflet icon paths to prevent asset resolution breakages during compilation loops
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Internal utility helper to animate camera pans automatically when a selected rail shifts
function RecenterMap({ coordinates }: { coordinates: [number, number] }) {
  const map = useMap();
  if (coordinates) {
    map.setView(coordinates, 4, { animate: true });
  }
  return null;
}

export default function MapComponent(props: any) {
  // Gracefully read both property naming bounds and default safely to an empty array
  const systems = props.railsData || props.systems || [];
  const activeRail = props.activeRail;
  
  const defaultCenter: [number, number] = [20.0, 0.0];

  return (
    <div className="w-full h-full">
      <MapContainer
        center={activeRail?.coordinates || defaultCenter}
        zoom={2}
        className="h-full w-full"
        style={{ background: "#0B111E" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {activeRail?.coordinates && (
          <RecenterMap coordinates={activeRail.coordinates} />
        )}

        {systems.map((system: any) => {
          const lat = system.coordinates?.[0] || system.latitude;
          const lng = system.coordinates?.[1] || system.longitude;

          if (!lat || !lng) return null;

          return (
            <Marker 
              key={system.id} 
              position={[lat, lng]}
              eventHandlers={{
                click: () => {
                  if (props.onMarkerClick) {
                    props.onMarkerClick(system);
                  }
                },
              }}
            >
              <Popup>
                <div className="text-slate-900 p-1 font-sans">
                  <strong className="block text-sm font-black">{system.name}</strong>
                  <span className="text-[11px] text-slate-500 font-medium">{system.region}</span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}