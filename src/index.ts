import { codechecks } from "@codechecks/client";

import { BuildSizeWatcherOptions, FullArtifact } from "./types";
import { getArtifactDiff } from "./getArtifactDiff";
import { getReportFromDiff } from "./getReportFromDiff";
import { normalizeOptions } from "./normalization";
import { getArtifact } from "./getArtifact";

export async function buildSizeWatcher(_options: BuildSizeWatcherOptions): Promise<void> {
  const options = normalizeOptions(_options);
  const cwd = codechecks.context.workspaceRoot;

  const fullArtifact = await getArtifact(options, cwd);

  await codechecks.saveValue(options.artifactName, fullArtifact);

  if (!codechecks.isPr()) {
    return;
  }

  const baseArtifact = await codechecks.getValue<FullArtifact>(options.artifactName);

  const diff = getArtifactDiff(fullArtifact, baseArtifact);

  const report = getReportFromDiff(diff, options.files, options);
  await codechecks.report(report);
}

export default buildSizeWatcher;
