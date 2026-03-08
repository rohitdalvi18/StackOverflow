import { AGENTS } from "../constants/agents";

export default function Scanning({ agentStatus, location }) {
  return (
    <div className="wg-scan">
      <div className="wg-scan-loc">
        ANALYZING: <span>{location.toUpperCase()}</span>
      </div>
      <div className="wg-agents-list">
        {AGENTS.map(a => {
          const state = agentStatus[a.key] || "idle";
          return (
            <div key={a.key} className={`wg-agent-row ${state}`}>
              <div className="wg-agent-indicator" />
              <div className="wg-agent-info">
                <div className="wg-agent-name">{a.name}</div>
                <div className="wg-agent-label">{a.label}</div>
              </div>
              <div className="wg-agent-check">✓</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}