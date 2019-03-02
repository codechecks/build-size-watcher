import { Report } from "super-ci/dist/client";
import { FullArtifactDiff } from "./types";
import bytes = require("bytes");

export function getReportFromDiff(diff: FullArtifactDiff): Report {
  const shortDescription = `Total: ${bytes(diff.totalSize)} Change ${renderSign(diff.totalSizeChange) +
    bytes(diff.totalSizeChange)} (${renderSign(diff.totalSizeChangeFraction) +
    renderFraction(diff.totalSizeChangeFraction)})`;

  return {
    name: "BundleSize",
    shortDescription,
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
