import { Report } from "super-ci/dist/client";
import { FullArtifactDiff } from "./types";
import bytes = require("bytes");
import { sortBy } from "lodash";

export function getReportFromDiff(diff: FullArtifactDiff): Report {
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
  | Status | Files | Now | Diff |
  | ------ | ----- | --- | ---- |
  ${reportKeys
    .map(fk => {
      const file = diff.files[fk];
      return `| ${file.type} | ${fk} | ${file.overallSize} | ${renderSize(file.sizeChange, file.sizeChangeFraction)} |`;
    })
    .join("\n")}
  `;

  return {
    name: "BuildSize",
    shortDescription,
    longDescription,
  };
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
