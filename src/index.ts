import { superCI } from "super-ci";
import * as glob from "glob";

import { BuildSizeOptions, FileArtifact, FullArtifact, FullArtifactDiff } from "./types";
import { getSize } from "./getSize";
import { join } from "path";
import { getArtifactDiff } from "./getArtifactDiff";
import { getReportFromDiff } from "./getReportFromDiff";

const ARTIFACT_KEY = "build-size";

export async function buildSize(options: BuildSizeOptions): Promise<void> {
  const cwd = superCI.context.workspaceRoot;

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

  await superCI.saveValue(ARTIFACT_KEY, fullArtifact);

  if (!superCI.isPr()) {
    return;
  }

  const baseArtifact = await superCI.getValue<FullArtifact>(ARTIFACT_KEY);

  const diff = getArtifactDiff(fullArtifact, baseArtifact);

  const report = getReportFromDiff(diff, options.files);
  await superCI.report(report);
}
