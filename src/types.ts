import { Dictionary } from "ts-essentials";

interface FileDescription {
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

export type ArtifactDiff = {
  type: "changed" | "new" | "deleted";
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

/**
 * SAMPLE:
 * {
 *  files: [
 *    {
 *      path: "./dist/main.*.js",
 *      name: "Main JS",
 *    },
 *    {
 *      path: "./dist/vendor.*.js"
 *      name: "Vendor JS"
 *    }
 *  ]
 * }
 *
 * Check output:
 * Short: "BundleSize: Total: 3.4 MB Change: +43B (0.01%)"
 * Long:
 * - Main JS ( 1 file ) — 1.2 MB. Change +12 B (+0.1%)
 * - Vendor JS ( 2 files ) - 2.5 MB. Change +135 KB (+1%)
 */

/** Artifact:
  * {
  *   Main JS: {
*       matched: number;
        size: number;
  *   },
  * }
  */
