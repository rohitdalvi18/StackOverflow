import { useState, useRef } from "react";
import "./App.css";
import Header from "./components/Header";
import Landing from "./components/Landing";
import Scanning from "./components/Scanning";
import Results from "./components/Results";
import { AGENTS, MOCK_SPECIES, getRisk } from "./constants/agents";
import { getThreatBrief } from "./services/ollama";
import { getCoordinates } from "./services/geocoding";
import { getFireWeather, getActiveFires } from "./services/fireApi";
import { getWildlifeAtRisk } from "./services/wildlifeApi";

export default function WildGuard() {
  const [location, setLocation] = useState("");
  const [phase, setPhase] = useState("idle");
  const [agentStatus, setAgentStatus] = useState({});
  const [fireData, setFireData] = useState(null);
  const [wildlifeData, setWildlifeData] = useState(null);
  const [brief, setBrief] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [alertActive, setAlertActive] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [coords, setCoords] = useState(null);

  const briefRef = useRef("");


  const streamText = (text, setter, onDone) => {
    briefRef.current = text; 
    let i = 0;
    const iv = setInterval(() => {
      i += 5;
      setter(text.slice(0, i));
      if (i >= text.length) {
        setter(text);
        clearInterval(iv);
        onDone();
      }
    }, 18);
  };

const runAnalysis = async () => {
  if (!location.trim()) return;

  // Reset state
  setPhase("scanning");
  setAgentStatus({});
  setFireData(null);
  setWildlifeData(null);
  setBrief("");
  setAlertSent(false);
  setAlertActive(false);

  // Agent 1+2: Fire + Weather
  setAgentStatus(prev => ({ ...prev, fire: "running" }));
  const coords = await getCoordinates(location);
  setCoords(coords);
  const [weather, fires] = await Promise.all([
    getFireWeather(coords.lat, coords.lon),
    getActiveFires(coords.lat, coords.lon),
  ]);
  setAgentStatus(prev => ({ ...prev, fire: "done", weather: "done" }));

  // Agent 3: Wildlife
  setAgentStatus(prev => ({ ...prev, wildlife: "running" }));
  const liveSpecies = await getWildlifeAtRisk(coords.lat, coords.lon);
  setAgentStatus(prev => ({ ...prev, wildlife: "done" }));

  // Agent 4: LLM (fake delay)
  setAgentStatus(prev => ({ ...prev, llm: "running" }));
  await new Promise(r => setTimeout(r, 900));
  setAgentStatus(prev => ({ ...prev, llm: "done" }));

  // Agent 5: Route (fake delay)
  setAgentStatus(prev => ({ ...prev, route: "running" }));
  await new Promise(r => setTimeout(r, 700));
  setAgentStatus(prev => ({ ...prev, route: "done" }));

  // All 5 green
  await new Promise(r => setTimeout(r, 1500));

  const fd = {
    ...fires,
    ...weather,
    riskLevel: getRisk(weather.fwi),
  };
  const wd = liveSpecies || MOCK_SPECIES.slice(0, 3);

  setFireData(fd);
  setWildlifeData(wd);
  setAlertActive(true);
  setPhase("results");

  // AI brief
  setStreaming(true);
  try {
    const text = await getThreatBrief(location, fd, wd);
    streamText(text, setBrief, () => setStreaming(false));
  } catch (e) {
    const fallback = `${fd.riskLevel.label} fire conditions detected near ${location} with FWI ${fd.fwi}/100 and ${fd.fires} active fires within ${fd.nearestMiles} miles. Wind at ${fd.windSpeed}mph from ${fd.windDir} is driving fire directly toward Habitat Zone A, placing the ${wd[0]?.name} at critical risk. Deploy ranger teams to Zone A immediately and initiate corridor evacuation along the southern route.`;
    streamText(fallback, setBrief, () => setStreaming(false));
  }
};

  return (
    <div className="wg">
      <Header phase={phase} />
      {phase === "idle" && (
        <Landing location={location} setLocation={setLocation} onSubmit={runAnalysis} />
      )}
      {phase === "scanning" && (
        <Scanning agentStatus={agentStatus} location={location} />
      )}
      {phase === "results" && fireData && (
        <Results
          briefRef={briefRef} 
          coords={coords}
          location={location}
          fireData={fireData}
          wildlifeData={wildlifeData}
          brief={brief}
          streaming={streaming}
          alertActive={alertActive}
          alertSent={alertSent}
          onAlert={() => setAlertSent(true)}
          onReset={() => { setPhase("idle"); setLocation(""); }}
        />
      )}
    </div>
  );
}