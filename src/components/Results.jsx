import FireMap from "./FireMap";
import { useState } from "react";
import { dispatchRangerAlert } from "../services/vapi";


export default function Results({ location, fireData, wildlifeData, brief, streaming, alertActive, alertSent, onAlert, onReset, coords, briefRef }) {
    const risk = fireData.riskLevel;
    const rc = risk.color;

    const handleAlert = async () => {
        console.log("brief:", briefRef.current);
        onAlert();
        await dispatchRangerAlert(location, fireData, wildlifeData, briefRef.current);
    };

    return (
        <div className="wg-results" style={{ "--rc": rc }}>
            {/* Risk + Metrics */}
            <div className="wg-panel wg-risk">
                <div className="wg-panel-head">// THREAT ASSESSMENT — {location.toUpperCase()}</div>
                <div className="wg-risk-score" style={{ borderColor: rc + "44", background: rc + "08" }}>
                    <div className="wg-risk-num" style={{ color: rc }}>{fireData.fwi}</div>
                    <div className="wg-risk-label">FIRE WEATHER INDEX</div>
                    <div className="wg-risk-level" style={{ color: rc }}>{risk.label}</div>
                </div>
                <div className="wg-metrics">
                    {[
                        { val: fireData.fires, key: "ACTIVE FIRES", color: "#ef4444" },
                        { val: fireData.nearestMiles === "N/A" ? "N/A" : `${fireData.nearestMiles}mi`, key: "NEAREST FIRE", color: "#f97316" },
                        { val: `${fireData.windSpeed}mph`, key: `WIND (${fireData.windDir})`, color: "#8b949e" },
                        { val: `${fireData.humidity}%`, key: "HUMIDITY", color: "#60a5fa" },
                    ].map(m => (
                        <div key={m.key} className="wg-metric">
                            <div className="wg-metric-val" style={{ color: m.color }}>{m.val}</div>
                            <div className="wg-metric-key">{m.key}</div>
                        </div>
                    ))}
                </div>

                <div>
                    <div className="wg-panel-head">// SPECIES AT RISK</div>
                    <div className="wg-species-list">
                        {wildlifeData.map(s => (
                            <div key={s.name} className="wg-species-item">
                                <div className="wg-species-icon">{s.icon}</div>
                                <div>
                                    <div className="wg-species-name">{s.name}</div>
                                    <div className="wg-species-status">{s.status}</div>
                                </div>
                                <div className="wg-species-zone">ZONE {s.habitat}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className="wg-map-area">
                <div className="wg-map">
                    <FireMap fireData={fireData} wildlifeData={wildlifeData} centerLat={coords.lat} centerLon={coords.lon} />
                </div>
            </div>

            {/* AI Brief */}
            <div className="wg-brief">
                <div className="wg-panel-head">// THREATCORE AI BRIEF — AGENT SYNTHESIS</div>
                <div className="wg-brief-text">
                    {!brief && (
                        <span className="wg-generating">
                            ⬡ THREATCORE ANALYZING THREAT VECTORS...
                        </span>
                    )}
                    {brief}
                    {streaming && <span className="wg-cursor" />}
                </div>
                <div className="wg-alert-row">
                    {alertActive && (
                        <button
                            className={`wg-alert-btn ${alertSent ? "sent" : ""}`}
                            onClick={!alertSent ? handleAlert : undefined}
                            disabled={alertSent || !briefRef.current}
                            style={{ opacity: !briefRef.current ? 0.4 : 1 }}
                        >
                            {!alertSent ? "⚠ DISPATCH RANGER ALERT" : "✓ RANGER ALERT DISPATCHED (VAPI)"}
                        </button>
                    )}
                    <button className="wg-reset-btn" onClick={onReset}>NEW SCAN</button>
                </div>
            </div>
        </div>
    );
}