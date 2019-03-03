import { SuperCiReport } from "super-ci";
import { FullArtifactDiff, FileDescription, ArtifactDiffType } from "./types";
import bytes = require("bytes");
import { sortBy, groupBy } from "lodash";

export function getReportFromDiff(diff: FullArtifactDiff, originalFiles: FileDescription[]): SuperCiReport {
  const originalFilesByPath = groupBy(originalFiles, "path");
  const shortDescription = `Total: ${bytes(diff.totalSize)} Change: ${renderSize(
    diff.totalSizeChange,
    diff.totalSizeChangeFraction,
  )}`;

  const reportKeys = sortBy(Object.keys(diff.files), k => {
    const value = diff.files[k];
    const typeVal = value.type === "changed" ? 1 : value.type === "new" ? 2 : 3;

    return typeVal * 10 + k;
  });

  const longDescription = `
  | Status | Files | Now | Diff | Max |
  | ------ | ----- | --- | ---- | --- |
  ${reportKeys
    .map(fk => {
      const f = diff.files[fk];
      const maxSize = originalFilesByPath[fk] && originalFilesByPath[fk][0].maxSize;

      // prettier-ignore
      return `| ${renderStatus(f.type, maxSize ? f.overallSize > maxSize : false)} | ${fk} | ${bytes(f.overallSize)} | ${renderSize(f.sizeChange, f.sizeChangeFraction)} | ${maxSize ? bytes(maxSize) : " — "} |`;
    })
    .join("\n")}
  `;

  const shouldFail = originalFiles
    .filter(file => file.maxSize)
    .reduce(
      (result, file) => (result || diff.files[file.path] ? diff.files[file.path].overallSize > file.maxSize! : false),
      false,
    );

  return {
    name: "BuildSize",
    shortDescription,
    longDescription,
    status: shouldFail ? "failure" : "success",
  };
}

function renderStatus(type: ArtifactDiffType, reachedMaxSize: boolean): string {
  if (reachedMaxSize) {
    return "🛑 Max size reached";
  }

  return type;
}

function renderSign(value: number): string {
  if (value > 0) {
    return "+";
  } else {
    // we dont' render signs for negative (it's part of a number xD) or 0
    return "";
  }
}

function renderFraction(value: number): string {
  return (value * 100).toFixed(2) + "%";
}

function renderSize(size: number, fraction: number): string {
  return `${renderSign(size) + bytes(size)} (${renderSign(fraction) + renderFraction(fraction)})`;
}
