export const MOCK_SPECIES = [
  { name: "California Condor", status: "CRITICALLY ENDANGERED", habitat: "A", icon: "🦅" },
  { name: "Sierra Nevada Fox", status: "ENDANGERED", habitat: "A", icon: "🦊" },
  { name: "Northern Spotted Owl", status: "THREATENED", habitat: "B", icon: "🦉" },
  { name: "Coho Salmon", status: "THREATENED", habitat: "C", icon: "🐟" },
  { name: "Giant Garter Snake", status: "THREATENED", habitat: "B", icon: "🐍" },
];

export const AGENTS = [
  { key: "fire", name: "FIREWATCH", label: "NASA FIRMS + FWI API" },
  { key: "weather", name: "WEATHERSCAN", label: "NOAA Wind & Conditions" },
  { key: "wildlife", name: "WILDTRACK", label: "GBIF Species Registry" },
  { key: "llm", name: "THREATCORE", label: "LLM Synthesis Agent" },
  { key: "route", name: "ROUTEGEN", label: "Evacuation Corridors" },
];

export const getRisk = (fwi) => {
  if (fwi >= 75) return { label: "EXTREME", color: "#ef4444" };
  if (fwi >= 55) return { label: "HIGH", color: "#f97316" };
  if (fwi >= 35) return { label: "MODERATE", color: "#eab308" };
  return { label: "LOW", color: "#22c55e" };
};