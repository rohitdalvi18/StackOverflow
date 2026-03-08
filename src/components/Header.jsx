export default function Header({ phase }) {
  const phaseLabel = { idle: "STANDBY", scanning: "AGENTS ACTIVE", results: "ANALYSIS COMPLETE" }[phase];
  const dotClass = phase === "scanning" ? "wg-dot active" : phase === "results" ? "wg-dot done" : "wg-dot";

  return (
    <header className="wg-header">
      <div className="wg-logo">
        <span className="wg-logo-hex">⬡</span>
        <div>
          <div className="wg-logo-name">WILDGUARD</div>
          <div className="wg-logo-sub">WILDLIFE EVACUATION AI // green-sentinel</div>
        </div>
      </div>
      <div className="wg-status">
        <span className={dotClass} />
        {phaseLabel}
      </div>
    </header>
  );
}
