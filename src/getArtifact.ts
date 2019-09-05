import * as glob from "glob";
import { join } from "path";

import { getSize } from "./getSize";
import { FullArtifact, NormalizedBuildSizeOptions, FileArtifact } from "./types";

export async function getArtifact(
  options: NormalizedBuildSizeOptions,
  cwd: string,
): Promise<FullArtifact> {
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

  return fullArtifact;
}
