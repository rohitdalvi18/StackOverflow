import { AGENTS } from "../constants/agents";

export default function Landing({ location, setLocation, onSubmit }) {
  return (
    <div className="wg-land">
      <div className="wg-land-hero">
        <div className="wg-land-title">WILD<span>GUARD</span></div>
        <div className="wg-land-tagline">// WILDLIFE WILDFIRE EVACUATION AI</div>
      </div>
      <p className="wg-land-desc">
        Multi-agent AI system that fuses live fire data, weather conditions, and wildlife habitat maps to generate real-time evacuation briefs for rangers.
      </p>
      <div className="wg-input-row">
        <input
          className="wg-input"
          placeholder="Enter zip code or location..."
          value={location}
          onChange={e => setLocation(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSubmit()}
        />
        <button className="wg-btn" onClick={onSubmit} disabled={!location.trim()}>
          ANALYZE →
        </button>
      </div>
      <div className="wg-agents-preview">
        {AGENTS.map(a => (
          <div key={a.key} className="wg-agent-chip">{a.name}</div>
        ))}
      </div>
    </div>
  );
}
