import { codechecks } from "@codechecks/client";
import * as glob from "glob";

import { BuildSizeWatcherOptions, FileArtifact, FullArtifact } from "./types";
import { getSize } from "./getSize";
import { join } from "path";
import { getArtifactDiff } from "./getArtifactDiff";
import { getReportFromDiff } from "./getReportFromDiff";
import { normalizeOptions } from "./normalization";

export async function buildSizeWatcher(_options: BuildSizeWatcherOptions): Promise<void> {
  const options = normalizeOptions(_options);
  const cwd = codechecks.context.workspaceRoot;

  const fullArtifact: FullArtifact = {};

  for (const file of options.files) {
    const matches = glob.sync(file.path, { cwd });

    const sizes = await Promise.all(matches.map(match => getSize(join(cwd, match), options.gzip)));
    const overallSize = sizes.reduce((a, b) => a + b, 0);

    const artifact: FileArtifact = {
      path: file.path,
      files: matches.length,
      overallSize,
    };

    fullArtifact[file.path] = artifact;
  }

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
