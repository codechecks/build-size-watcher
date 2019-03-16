import { BuildSizeOptions, NormalizedBuildSizeOptions, FileDescription, NormalizedFileDescription } from "./types";

import bytes = require("bytes");

export function normalizeOptions(options: BuildSizeOptions): NormalizedBuildSizeOptions {
  return {
    gzip: options.gzip === undefined ? true : options.gzip,
    files: options.files.map(normalizeFileDescription),
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
