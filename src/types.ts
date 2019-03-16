import { Dictionary } from "ts-essentials";

export interface FileDescription {
  path: string; // supports glob
  maxSize?: number | string;
}

export interface BuildSizeOptions {
  files: FileDescription[];
}

export interface NormalizedFileDescription {
  path: string; // supports glob
  maxSize?: number;
}

export interface NormalizedBuildSizeOptions {
  files: NormalizedFileDescription[];
}

export interface FileArtifact {
  path: string;
  files: number;
  overallSize: number;
}

export type FullArtifact = Dictionary<FileArtifact>;

export type ArtifactDiffType = "changed" | "new" | "deleted";

export type ArtifactDiff = {
  type: ArtifactDiffType;
  overallSize: number;
  sizeChange: number;
  sizeChangeFraction: number;
};

export type FullArtifactDiff = {
  totalSize: number;
  totalSizeChange: number;
  totalSizeChangeFraction: number;
  files: Dictionary<ArtifactDiff>;
};
