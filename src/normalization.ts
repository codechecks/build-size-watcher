import {
  BuildSizeWatcherOptions,
  NormalizedBuildSizeOptions,
  FileDescription,
  NormalizedFileDescription,
} from "./types";

import bytes = require("bytes");

export function normalizeOptions(options: BuildSizeWatcherOptions): NormalizedBuildSizeOptions {
  const name = options.name || "Build Size";
  return {
    gzip: options.gzip === undefined ? true : options.gzip,
    files: options.files.map(normalizeFileDescription),
    name,
    artifactName: `build-size:${name}`,
    historyArtifactName: `build-size-history:${name}`,
  };
}

export function normalizeFileDescription(file: FileDescription): NormalizedFileDescription {
  let maxSize: number | undefined;
  if (file.maxSize) {
    maxSize = bytes.parse(file.maxSize);
  }

  return {
    path: file.path,
    maxSize,
  };
}
