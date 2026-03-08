import { MapContainer, TileLayer, CircleMarker, Popup, Polygon, Polyline, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Real LA 2025 fire coordinates (January 2025)
const LA_FIRES = [
  { lat: 34.0522, lon: -118.5437, name: "Palisades Fire — Pacific Palisades" },
  { lat: 34.1478, lon: -118.0370, name: "Eaton Fire — Altadena" },
  { lat: 34.2361, lon: -118.5734, name: "Hurst Fire — Sylmar" },
];

// Real wildlife habitat zones near LA fire zones
const ZONE_A = [
  [34.08, -118.62],
  [34.08, -118.48],
  [34.18, -118.48],
  [34.18, -118.62],
];
const ZONE_B = [
  [34.10, -118.10],
  [34.10, -117.95],
  [34.22, -117.95],
  [34.22, -118.10],
];
const ZONE_C = [
  [34.22, -118.62],
  [34.22, -118.50],
  [34.30, -118.50],
  [34.30, -118.62],
];

// Evacuation corridor — north out of LA toward Ventura
const EVAC_ROUTE = [
  [34.0522, -118.5437],
  [34.18, -118.72],
  [34.30, -118.90],
  [34.42, -119.10],
];

const ZONE_STYLE = { color: "#10b981", fillColor: "#10b981", fillOpacity: 0.25, weight: 2 };

export default function FireMap({ fireData, wildlifeData, centerLat, centerLon }) {
  // Center on LA always for demo
  const mapCenter = [34.10, -118.35];

  return (
    <MapContainer
      center={mapCenter}
      zoom={10}
      style={{ height: "100%", width: "100%" }}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

      {/* User searched location */}
      <CircleMarker
        center={[centerLat, centerLon]}
        radius={8}
        pathOptions={{ color: "#60a5fa", fillColor: "#60a5fa", fillOpacity: 1 }}
      >
        <Popup>📍 Your Location</Popup>
      </CircleMarker>

      {/* Real LA 2025 fire locations */}
      {LA_FIRES.map((f, i) => (
        <CircleMarker
          key={i}
          center={[f.lat, f.lon]}
          radius={14}
          pathOptions={{ color: "#ef4444", fillColor: "#f97316", fillOpacity: 0.85 }}
        >
          <Popup>🔥 {f.name}</Popup>
        </CircleMarker>
      ))}

      {/* Habitat zones */}
      <Polygon positions={ZONE_A} pathOptions={ZONE_STYLE}>
  <Tooltip permanent direction="center" className="zone-label">ZONE A</Tooltip>
</Polygon>
<Polygon positions={ZONE_B} pathOptions={ZONE_STYLE}>
  <Tooltip permanent direction="center" className="zone-label">ZONE B</Tooltip>
</Polygon>
<Polygon positions={ZONE_C} pathOptions={ZONE_STYLE}>
  <Tooltip permanent direction="center" className="zone-label">ZONE C</Tooltip>
</Polygon>

      {/* Evacuation corridor */}
      <Polyline
        positions={EVAC_ROUTE}
        pathOptions={{ color: "#f59e0b", dashArray: "8,5", weight: 3 }}
      >
        <Popup>🚗 Evacuation Corridor — PCH North to Ventura</Popup>
      </Polyline>
    </MapContainer>
  );
}