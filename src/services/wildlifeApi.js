const IUCN_CATEGORIES = { CR: "CRITICALLY ENDANGERED", EN: "ENDANGERED", VU: "VULNERABLE", NT: "THREATENED" };
const ICONS = { Aves: "🦅", Mammalia: "🦊", Reptilia: "🐍", Amphibia: "🐸", Actinopterygii: "🐟", default: "🐾" };

export async function getWildlifeAtRisk(lat, lon) {
  const delta = 0.8;
  const res = await fetch(
    `https://api.gbif.org/v1/occurrence/search?` +
    `decimalLatitude=${(lat - delta).toFixed(2)},${(lat + delta).toFixed(2)}` +
    `&decimalLongitude=${(lon - delta).toFixed(2)},${(lon + delta).toFixed(2)}` +
    `&iucnRedListCategory=CR&iucnRedListCategory=EN&iucnRedListCategory=VU` +
    `&hasCoordinate=true&limit=20`
  );
  const data = await res.json();
  console.log("🐾 GBIF RAW:", data);

  // Deduplicate by species name
  const seen = new Set();
  const species = [];
  for (const occ of data.results || []) {
    const name = occ.species || occ.scientificName;
    if (!name || seen.has(name)) continue;
    seen.add(name);
    species.push({
      name: occ.vernacularName || name,
      status: IUCN_CATEGORIES[occ.iucnRedListCategory] || "THREATENED",
      habitat: ["A", "B", "C"][species.length % 3],
      icon: ICONS[occ.class] || ICONS.default,
    });
    if (species.length >= 5) break;
  }

  console.log("🦅 SPECIES PARSED:", species);
  return species.length ? species : null; // null = fall back to mock
}