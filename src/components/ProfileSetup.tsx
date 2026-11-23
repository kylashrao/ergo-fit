import SetupBlueprintCard from "./SetupBlueprintCard";
import { setupMeasurements } from "@/lib/setupDisplay";
import type { ErgoFit } from "@/lib/ergoMath";

export default function ProfileSetup({ fit }: { fit: ErgoFit }) {
  return (
    <div className="workbench profile-workbench">
      <section className="panel profile-specs" aria-labelledby="profile-specs-title">
        <h2 id="profile-specs-title">Estimated setup dimensions</h2>
        <p>Based on this example with shoes on. Check these settings against your own seated and standing measurements.</p>
        <dl>
          {setupMeasurements(fit).map(({ label, value }) => <div key={label}>
            <dt>{label}</dt><dd>{value.inches} in <span>· {value.cm} cm</span></dd>
          </div>)}
          <div><dt>Minimum desk depth</dt><dd>{fit.minDeskDepth.inches} in <span>· {fit.minDeskDepth.cm} cm</span></dd></div>
        </dl>
      </section>
      <SetupBlueprintCard fit={fit} units="imperial" />
    </div>
  );
}
