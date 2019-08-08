import { Dictionary } from "ts-essentials";

export interface FileDescription {
  path: string; // supports glob
  maxSize?: number | string;
}

export interface BuildSizeWatcherOptions {
  gzip?: boolean; // defaults to true
  files: FileDescription[];
  name?: string; // defaults to "Build Size"
}

export interface NormalizedFileDescription {
  path: string; // supports glob
  maxSize?: number;
}

export interface NormalizedBuildSizeOptions {
  gzip: boolean;
  files: NormalizedFileDescription[];
  name: string;
  artifactName: string;
  historyArtifactName: string;
}

export interface FileArtifact {
  path: string;
  files: number;
  overallSize: number;
}

export type FullArtifact = Dictionary<FileArtifact>;

export type HistoryArtifact = { hash: string; artifact: FullArtifact }[];

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
