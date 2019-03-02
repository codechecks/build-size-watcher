import { FullArtifact, FullArtifactDiff, ArtifactDiff } from "./types";
import { values } from "lodash";
import { Dictionary } from "ts-essentials";

export function getArtifactDiff(A: FullArtifact, B: FullArtifact = {}): FullArtifactDiff {
  const totalSizeA = values(A)
    .map(f => f.overallSize)
    .reduce((a, b) => a + b, 0);
  const totalSizeB = values(B)
    .map(f => f.overallSize)
    .reduce((a, b) => a + b, 0);

  const totalSizeChange = totalSizeA - totalSizeB;
  const totalSizeChangeFraction = (totalSizeA - totalSizeB) / totalSizeB;

  const files: Dictionary<ArtifactDiff> = {};

  for (const aKey of [...Object.keys(A), ...Object.keys(B)]) {
    const a = A[aKey];
    const b = B[aKey];

    if (a && b) {
      files[aKey] = {
        type: "changed",
        overallSize: a.overallSize,
        sizeChange: a.overallSize - b.overallSize,
        sizeChangeFraction: (a.overallSize - b.overallSize) / b.overallSize,
      };
    } else if (!b) {
      files[aKey] = {
        type: "new",
        overallSize: a.overallSize,
        sizeChange: a.overallSize,
        sizeChangeFraction: 100,
      };
    } else {
      files[aKey] = {
        type: "deleted",
        overallSize: 0,
        sizeChange: -1 * b.overallSize,
        sizeChangeFraction: -100,
      };
    }
  }

  return {
    totalSize: totalSizeA,
    totalSizeChange,
    totalSizeChangeFraction,
    files,
  };
}
