const GEMINI_KEY = process.env.REACT_APP_GEMINI_KEY;

export async function getThreatBrief(location, fireData, species) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are WildGuard's ThreatCore AI — an emergency wildlife evacuation agent.
Generate a 3-sentence operational threat brief for wildlife rangers based on:

Location: ${location}
Fire Weather Index: ${fireData.fwi}/100 — ${fireData.riskLevel.label} RISK
Active fires: ${fireData.fires} detected, nearest at ${fireData.nearestMiles} miles
Wind: ${fireData.windSpeed} mph from ${fireData.windDir}
Humidity: ${fireData.humidity}% | Temp: ${fireData.temp}°F
Species in the fire path: ${species.map(s => `${s.name} [${s.status}]`).join(", ")}

Sentence 1: current threat conditions. Sentence 2: which species are most at risk and why. Sentence 3: immediate action order with habitat zone priority. Be direct, operational, urgent. No preamble.`
          }]
        }]
      })
    }
  );
  const data = await res.json();
  console.log("gem: ", data);
  
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}
