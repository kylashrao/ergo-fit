"use client";

import { useId, useState } from "react";
import { calculateErgoFit, cmToInches, inchesToCm, REAR_CHAIR_CLEARANCE_INCHES } from "@/lib/ergoMath";
import { formatFootprint, formatLength, setupMeasurements, type UnitSystem } from "@/lib/setupDisplay";
import SetupBlueprintCard from "./SetupBlueprintCard";
import GearMatchList from "./GearMatchList";

function NumberField({ label, suffix, value, onValue, maxExclusive }: {
  label: string;
  suffix: string;
  value: number | undefined;
  onValue: (value: number | undefined) => void;
  maxExclusive?: number;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <label className="number-field">
      <span className="sr-only">{label} in {suffix}</span>
      <input
        type="number"
        min="0"
        step="any"
        inputMode="decimal"
        placeholder="—"
        value={draft ?? (value === undefined ? "" : Number(value.toFixed(2)))}
        onChange={(event) => {
          const input = event.currentTarget;
          setDraft(input.value);
          if (!input.validity.badInput) {
            const next = input.valueAsNumber;
            if (Number.isFinite(next) && next >= 0 && (maxExclusive === undefined || next < maxExclusive)) onValue(next);
            else if (input.value === "") onValue(undefined);
          }
        }}
        onBlur={() => setDraft(null)}
      />
      <span aria-hidden="true">{suffix}</span>
    </label>
  );
}

function LengthFields({ label, units, split, value, onValue }: {
  label: string;
  units: UnitSystem;
  split: boolean;
  value: number | undefined;
  onValue: (value: number | undefined) => void;
}) {
  const metric = units === "metric";
  const display = value === undefined ? undefined : metric ? inchesToCm(value) : value;
  const radix = metric ? 100 : 12;
  const normalized = display === undefined ? undefined : Number(display.toFixed(8));
  const major = normalized === undefined ? undefined : Math.floor(normalized / radix);
  const minor = normalized === undefined ? undefined : normalized - (major ?? 0) * radix;
  const update = (next?: number) => onValue(next === undefined ? undefined : metric ? cmToInches(next) : next);

  return (
    <div className="length-fields" key={`${units}-${split}`}>
      {split ? <>
        <NumberField label={label} suffix={metric ? "m" : "ft"} value={major}
          onValue={(next) => update(next === undefined && !minor ? undefined : (next ?? 0) * radix + (minor ?? 0))} />
        <NumberField label={label} suffix={metric ? "cm" : "in"} value={minor} maxExclusive={radix}
          onValue={(next) => update(next === undefined && !major ? undefined : (major ?? 0) * radix + (next ?? 0))} />
      </> : <NumberField label={label} suffix={metric ? "cm" : "in"} value={display} onValue={update} />}
    </div>
  );
}

const presets = [
  { height: 60, label: "5′0″ Petite", metricLabel: "Petite" },
  { height: 66, label: "5′6″" },
  { height: 70, label: "5′10″" },
  { height: 75, label: "6′3″ Tall", metricLabel: "Tall" },
];

export default function ErgoCalculator({ focus }: { focus?: "desk" | "chair" } = {}) {
  const sliderId = useId();
  const [units, setUnits] = useState<UnitSystem>("imperial");
  const [heightSplit, setHeightSplit] = useState(true);
  const [roomSplit, setRoomSplit] = useState(false);
  const [height, setHeight] = useState(69);
  const [wearsShoes, setWearsShoes] = useState(true);
  const [monitorInches, setMonitorInches] = useState(27);
  const [dualMonitor, setDualMonitor] = useState(false);
  const [roomWidthInches, setRoomWidth] = useState<number>();
  const [roomDepthInches, setRoomDepth] = useState<number>();
  const fit = calculateErgoFit({ heightInches: height, wearsShoes, monitorInches, dualMonitor, roomWidthInches, roomDepthInches });
  const metric = units === "metric";
  const format = (inches: number) => formatLength(inches, units);
  const splitLabel = metric ? "m + cm" : "ft + in";
  const totalLabel = metric ? "cm" : "Total in";
  const space = fit.spaceFit;
  const measurements = setupMeasurements(fit);
  const targets = focus === "desk" ? [
    ...measurements.slice(0, 2),
    { label: "Minimum desk depth", value: fit.minDeskDepth },
  ] : focus === "chair" ? measurements.slice(2, 4) : measurements;

  return (
    <>
      <div className="workbench">
        <section className="panel controls" aria-labelledby="measurements-title">
          <div className="panel-heading">
            <h2 id="measurements-title">Your measurements</h2>
            <div className="segmented" role="group" aria-label="Unit system">
              <button type="button" aria-pressed={!metric} onClick={() => setUnits("imperial")}>Imperial</button>
              <button type="button" aria-pressed={metric} onClick={() => setUnits("metric")}>Metric</button>
            </div>
          </div>
          <fieldset className="control-group">
            <legend>Height</legend>
            <div className="measurement-row">
              <LengthFields label="Height" units={units} split={heightSplit} value={height}
                onValue={(next) => { if (next !== undefined) setHeight(Math.max(56, Math.min(80, next))); }} />
              <label className="format-select">
                <span className="sr-only">Height input format</span>
                <select value={heightSplit ? "split" : "total"} onChange={(event) => setHeightSplit(event.target.value === "split")}>
                  <option value="split">{splitLabel}</option>
                  <option value="total">{totalLabel}</option>
                </select>
              </label>
            </div>
            <label className="sr-only" htmlFor={sliderId}>Height slider</label>
            <input id={sliderId} className="height-slider" type="range" min={metric ? 142 : 56} max={metric ? 203 : 80}
              step={metric ? 0.5 : 0.5} value={metric ? Math.round(inchesToCm(height) * 2) / 2 : height}
              aria-valuetext={format(height)}
              onChange={(event) => {
                const next = event.currentTarget.valueAsNumber;
                setHeight(metric ? next === 142 ? 56 : next === 203 ? 80 : cmToInches(next) : next);
              }} />
            <div className="range-labels"><span>{metric ? "142 cm" : "4′8″"}</span><span>{metric ? "203 cm" : "6′8″"}</span></div>
            <div className="presets" role="group" aria-label="Height presets">
              {presets.map((preset) => <button type="button" key={preset.height} aria-pressed={height === preset.height}
                onClick={() => setHeight(preset.height)}>{metric ? [format(preset.height), preset.metricLabel].filter(Boolean).join(" ") : preset.label}</button>)}
            </div>
          </fieldset>

          <label className="toggle-row">
            <span><strong>Wearing shoes / slippers</strong><small>Adds {metric ? "2.5 cm" : "1.0 in"} to height targets</small></span>
            <input type="checkbox" className="switch" checked={wearsShoes} onChange={(event) => setWearsShoes(event.target.checked)} />
          </label>

          {focus !== "chair" && <fieldset className="control-group monitor-group">
            <legend>Monitor size</legend>
            <div className="monitor-options" role="group" aria-label="Monitor diagonal size">
              {[24, 27, 32, 34].map((size) => <button type="button" key={size} aria-pressed={monitorInches === size}
                onClick={() => setMonitorInches(size)}>{size}″{size === 34 && <small>Ultrawide</small>}</button>)}
            </div>
            <label className="toggle-row">
              <span><strong>Dual monitors</strong><small>Uses the depth estimate for two displays on stands</small></span>
              <input type="checkbox" className="switch" checked={dualMonitor} onChange={(event) => setDualMonitor(event.target.checked)} />
            </label>
          </fieldset>}

          <details id="room" className="room-controls" open={focus === "desk" || undefined}>
            <summary>Room &amp; small-space check <span>Optional</span></summary>
            <div className="room-fields">
              <label className="format-select room-format">
                <span>Room input format</span>
                <select value={roomSplit ? "split" : "total"} onChange={(event) => setRoomSplit(event.target.value === "split")}>
                  <option value="total">{totalLabel}</option>
                  <option value="split">{splitLabel}</option>
                </select>
              </label>
              <div className="room-dimensions">
                <div><p>Available wall width</p><LengthFields label="Available wall width" units={units} split={roomSplit} value={roomWidthInches} onValue={setRoomWidth} /></div>
                <div><p>Room depth</p><LengthFields label="Room depth" units={units} split={roomSplit} value={roomDepthInches} onValue={setRoomDepth} /></div>
              </div>
              <p className="muted">The plan reserves {format(REAR_CHAIR_CLEARANCE_INCHES)} behind the desk for chair movement.</p>
            </div>
          </details>
        </section>

        <SetupBlueprintCard fit={fit} units={units} />
      </div>

      <section className="targets" id="targets" aria-labelledby="targets-title">
        <div className="section-heading">
          <h2 id="targets-title">{focus === "desk" ? "Your desk targets" : focus === "chair" ? "Your chair targets" : "Your fit targets"}</h2>
          <p>Adjust your equipment toward these starting measurements.</p>
        </div>
        <dl className={focus ? "target-grid focused-targets" : "target-grid"}>
          {targets.map(({ label, value }) => <div key={label}>
            <dt>{label}</dt><dd>{format(value.exactInches)}</dd>
          </div>)}
        </dl>
        <div className="callouts">
          {focus !== "chair" && <p><strong>Desk depth</strong> {format(fit.minDeskDepthInches)} minimum{fit.minDeskDepthInches === 24 ? " with a clamp-mounted monitor arm." : " for this display setup."}</p>}
          {focus !== "desk" && fit.needsLowCylinder && <p><strong>Low-cylinder chair</strong> Look for a seat that lowers to {format(fit.seatHeight.exactInches)}.</p>}
          {fit.footrestHeightForStandardDesk.inches > 0 && <p><strong>Fixed-desk foot support</strong> If you raise the chair for a {format(29.5)} desk, the estimated lift is {format(fit.footrestHeightForStandardDesk.exactInches)}.</p>}
          {focus === "chair" && <p><strong>Aeron size estimate</strong> {fit.aeronSize}. Check the actual seat pan and cylinder before buying.</p>}
          {focus !== "chair" && <p role="status"><strong>Small-space fit</strong> {space
            ? space.fitsComfortably
              ? `${formatFootprint(space.recommendedFootprint, units)} recommended. Up to ${format(space.maxDeskDepth.exactInches)} of desk depth after chair clearance.`
              : `Tight nook. Available desk area is ${format(space.maxDeskWidth.exactInches)} wide × ${format(space.maxDeskDepth.exactInches)} deep after chair clearance.`
            : "Enter both room dimensions to check the desktop footprint."}</p>}
        </div>
      </section>

      <GearMatchList fit={fit} units={units} focus={focus} />
    </>
  );
}
