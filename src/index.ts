import { codeChecks } from "codechecks";
import * as glob from "glob";

import { BuildSizeOptions, FileArtifact, FullArtifact } from "./types";
import { getSize } from "./getSize";
import { join } from "path";
import { getArtifactDiff } from "./getArtifactDiff";
import { getReportFromDiff } from "./getReportFromDiff";
import { normalizeOptions } from "./normalization";

const ARTIFACT_KEY = "build-size";

export async function buildSize(_options: BuildSizeOptions): Promise<void> {
  const options = normalizeOptions(_options);
  const cwd = codeChecks.context.workspaceRoot;

  const fullArtifact: FullArtifact = {};

  for (const file of options.files) {
    const matches = glob.sync(file.path, { cwd });

    const sizes = await Promise.all(matches.map(match => getSize(join(cwd, match))));
    const overallSize = sizes.reduce((a, b) => a + b, 0);

    const artifact: FileArtifact = {
      path: file.path,
      files: matches.length,
      overallSize,
    };

    fullArtifact[file.path] = artifact;
  }

  await codeChecks.saveValue(ARTIFACT_KEY, fullArtifact);

  if (!codeChecks.isPr()) {
    return;
  }

  const baseArtifact = await codeChecks.getValue<FullArtifact>(ARTIFACT_KEY);

  const diff = getArtifactDiff(fullArtifact, baseArtifact);

  const report = getReportFromDiff(diff, options.files);
  await codeChecks.report(report);
}
