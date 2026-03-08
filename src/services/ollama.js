const PROMPT = (location, fireData, species) => `
You are WildGuard's ThreatCore AI — an emergency wildlife evacuation agent.
Generate a 3-sentence operational threat brief for wildlife rangers based on:

Location: ${location}
Fire Weather Index: ${fireData.fwi}/100 — ${fireData.riskLevel.label} RISK
Active fires: ${fireData.fires} detected, nearest at ${fireData.nearestMiles} miles
Wind: ${fireData.windSpeed} mph from ${fireData.windDir} pushing fire toward habitat zones
Humidity: ${fireData.humidity}% | Temp: ${fireData.temp}°F
Species in the fire path: ${species.map(s => `${s.name} [${s.status}]`).join(", ")}

Sentence 1: current threat conditions.
Sentence 2: which species are most at risk and why based on wind direction and proximity.
Sentence 3: immediate action order with specific habitat zone priority.
Be direct, operational, urgent. No preamble.
`.trim();

export async function getThreatBrief(location, fireData, species) {
  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-oss:20b",
      prompt: PROMPT(location, fireData, species),
      stream: false,
    }),
  });

  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const data = await res.json();
  console.log("ollama: ", data);
  
  return data.response;
}