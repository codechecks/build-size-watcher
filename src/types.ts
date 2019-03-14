import { Dictionary } from "ts-essentials";

export interface FileDescription {
  path: string; // supports glob so this could match multiple files really
  maxSize?: number;
}

export interface BuildSizeOptions {
  files: FileDescription[];
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
