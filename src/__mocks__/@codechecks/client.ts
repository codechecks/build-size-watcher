import * as CC from "@codechecks/client";
import { join } from "path";

export const codechecks: Partial<typeof CC.codechecks> = {
  report: jest.fn(),
  getValue: jest.fn(),
  saveValue: jest.fn(),
  getDirectory: jest.fn(),
  saveDirectory: jest.fn(),
  isPr: jest.fn(),
  context: {
    currentSha: "eeb6f98b8d0a93de251ea3e4a9d02e61ec850286",
    currentBranchName: "master",
    workspaceRoot: join(__dirname, "..", ".."),
  } as any,
};
