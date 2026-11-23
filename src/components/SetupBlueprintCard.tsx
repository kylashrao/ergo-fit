"use client";

import { useState } from "react";
import { REAR_CHAIR_CLEARANCE_INCHES, type ErgoFit } from "@/lib/ergoMath";
import { formatFootprint, formatLength, setupMeasurements, type UnitSystem } from "@/lib/setupDisplay";

export default function SetupBlueprintCard({ fit, units }: { fit: ErgoFit; units: UnitSystem }) {
  const [copiedSummary, setCopiedSummary] = useState("");
  const [failedSummary, setFailedSummary] = useState("");
  const format = (inches: number) => formatLength(inches, units);
  const measurements = setupMeasurements(fit);
  const space = fit.spaceFit;
  const roomSummary = space && (
    space.fitsComfortably
      ? formatFootprint(space.recommendedFootprint, units)
      : "Tight nook"
  );
  const summary = [
    "My ergo-fit workstation setup",
    `Height: ${format(fit.height.exactInches)} · ${fit.shoeAllowance.inches ? "Shoes on" : "Shoes off"}`,
    `Displays: ${fit.dualMonitor ? "2" : "1"} × ${fit.monitorInches}″`,
    ...measurements.map(({ label, value }) => `${label}: ${format(value.exactInches)}`),
    `Minimum desk depth: ${format(fit.minDeskDepthInches)}`,
    ...(space && fit.roomDepth ? [
      `Wall width: ${format(space.maxDeskWidth.exactInches)}`,
      `Room depth: ${format(fit.roomDepth.exactInches)}`,
      `Rear chair clearance: ${format(REAR_CHAIR_CLEARANCE_INCHES)}`,
      `Desk footprint: ${roomSummary}`,
    ] : []),
    "Educational workstation sizing guidance only. This is not medical advice.",
  ].join("\n");

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopiedSummary(summary);
      setFailedSummary("");
    } catch {
      setFailedSummary(summary);
      setCopiedSummary("");
    }
  }

  function saveSpecCard() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;
    canvas.width = 1000;
    canvas.height = 1500;

    context.fillStyle = "#eeebfc";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#fff";
    context.fillRect(48, 48, 904, 1404);
    context.fillStyle = "#5335ae";
    context.font = "bold 31px system-ui";
    context.fillText("ergo-fit", 105, 135);
    context.fillStyle = "#1d1933";
    context.font = "bold 62px system-ui";
    context.fillText("My workstation setup", 105, 237);
    context.font = "32px system-ui";
    const rows = summary.split("\n").slice(1, -1);
    for (const [index, row] of rows.entries()) {
      context.fillText(row, 105, 330 + index * 71, 790);
    }
    context.fillStyle = "#59556b";
    context.font = "26px system-ui";
    context.fillText("Educational sizing guidance. This is not medical advice.", 105, 1395, 790);
    const download = document.createElement("a");
    download.download = "ergo-fit-setup.png";
    download.href = canvas.toDataURL("image/png");
    download.click();
  }

  return (
    <section className="panel blueprint" id="blueprint" aria-labelledby="blueprint-title">
      <div className="panel-heading">
        <h2 id="blueprint-title">Setup blueprint</h2>
        <button type="button" className="copy-button" onClick={copySummary}>
          <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="7" y="6" width="9" height="11" rx="2" /><path d="M12 6V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h1" /></svg>
          {copiedSummary === summary ? "Summary copied" : "Copy Setup Summary"}
        </button>
      </div>
      <figure className="blueprint-figure">
        <div className="blueprint-drawings">
          <svg viewBox="0 0 310 225" role="img" aria-label={`Seated workstation. Desk ${format(fit.seatedDeskHeight.exactInches)}, seat ${format(fit.seatHeight.exactInches)}, seat depth ${format(fit.seatDepth.exactInches)}, monitor top ${format(fit.monitorTopBezelHeight.exactInches)}.`}>
            <title>Seated workstation</title>
            <path className="diagram-floor" d="M21 177H289" />
            <path className="diagram-guide" d="M105 64H269M111 133H168" />
            <g className="diagram-furniture">
              <path d="M163 112h93v8h-93zM172 120v57m72-57v57" />
              <rect x="203" y="64" width="33" height="31" rx="3" />
              <path d="M219 95v13m-12 0h24" />
              <path d="M78 106v28h59m-25 0v35m-23 5 23-5 23 5" />
            </g>
            <g className="diagram-person">
              <circle cx="110" cy="64" r="14" />
              <path d="M103 79 96 102l8 26h39l-2 44h20M106 90l14 22h39" />
            </g>
            <g className="diagram-dimensions">
              <path d="M269 64v113m-4-113h8m-8 113h8M155 134v43m-4-43h8m-8 43h8M90 144h48m-48-4v8m48-8v8M257 112v65m-4-65h8m-8 65h8" />
              <path d="M127 57H199m-72-4v8m72-8v8" />
            </g>
            <text x="163" y="48" textAnchor="middle">{format(fit.viewingDistance.exactInches)} view</text>
            <text x="267" y="50" textAnchor="middle">{format(fit.monitorTopBezelHeight.exactInches)}</text>
            <text x="267" y="34" textAnchor="middle">Bezel top</text>
            <text x="112" y="160" textAnchor="middle">{format(fit.seatDepth.exactInches)}</text>
            <text x="143" y="199" textAnchor="end">Seat {format(fit.seatHeight.exactInches)}</text>
            <text x="257" y="199" textAnchor="end">Desk {format(fit.seatedDeskHeight.exactInches)}</text>
          </svg>
          <svg viewBox="0 0 230 225" role="img" aria-label={`Standing workstation. Desk height ${format(fit.standingDeskHeight.exactInches)}.`}>
            <title>Standing workstation</title>
            <path className="diagram-floor" d="M14 177H218" />
            <path className="diagram-guide" d="M65 50H171" />
            <g className="diagram-furniture">
              <path d="M111 96h89v8h-89zM121 104v73m65-73v73" />
              <rect x="153" y="50" width="30" height="29" rx="3" />
              <path d="M168 79v13m-12 0h24" />
            </g>
            <g className="diagram-person">
              <circle cx="67" cy="49" r="14" />
              <path d="M64 66 59 98l3 25 5 50h21M62 123l-9 50h10M66 73l15 23h26" />
            </g>
            <g className="diagram-dimensions">
              <path d="M207 96v81m-4-81h8m-8 81h8" />
            </g>
            <text x="206" y="199" textAnchor="end">Desk {format(fit.standingDeskHeight.exactInches)}</text>
          </svg>
        </div>
        <figcaption><span>Seated</span><span>Standing</span></figcaption>
        {space && fit.roomDepth && <div className="diagram-room">
          <svg viewBox="0 0 124 58" aria-hidden="true">
            <path className="diagram-dimensions" d="M15 6h92m-92-3v6m92-6v6m7 6v38m-3-38h6m-6 38h6" />
            <rect x="15" y="14" width="92" height="38" rx="3" fill="#e5dcf9" stroke="#7255b7" />
            <path d="M15 24h92" stroke="#7255b7" strokeDasharray="3 3" />
            <path d="M61 29v16m-3-16h6m-6 16h6" stroke="#7255b7" />
          </svg>
          <span>Wall width <strong>{format(space.maxDeskWidth.exactInches)}</strong></span>
          <span>Room depth <strong>{format(fit.roomDepth.exactInches)}</strong></span>
          <span>Rear chair clearance <strong>{format(REAR_CHAIR_CLEARANCE_INCHES)}</strong></span>
        </div>}
      </figure>
      <div className="spec-card">
        <div className="spec-card-heading">
          <h3>Setup spec card</h3>
          <button type="button" className="save-card" onClick={saveSpecCard}>Save PNG</button>
        </div>
        <p>{format(fit.height.exactInches)} user · {fit.dualMonitor ? "Two" : "One"} {fit.monitorInches}″ {fit.dualMonitor ? "displays" : "display"}</p>
        <dl>
          {measurements.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{format(value.exactInches)}</dd></div>)}
          <div><dt>Minimum desk depth</dt><dd>{format(fit.minDeskDepthInches)}</dd></div>
          {roomSummary && <div><dt>Desk footprint</dt><dd>{roomSummary}</dd></div>}
        </dl>
      </div>
      <span className="sr-only" role="status">{copiedSummary === summary ? "Setup summary copied to clipboard." : ""}</span>
      {failedSummary === summary && <label className="manual-copy">
        Clipboard unavailable. Select and copy your summary.
        <textarea readOnly value={summary} onFocus={(event) => event.target.select()} />
      </label>}
    </section>
  );
}
