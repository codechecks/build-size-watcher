import * as SuperCI from "super-ci";
import { join } from "path";

export const superCI: Partial<typeof SuperCI.superCI> = {
  report: jest.fn(),
  getValue: jest.fn(),
  saveValue: jest.fn(),
  getCollection: jest.fn(),
  saveCollection: jest.fn(),
  isPr: jest.fn(),
  context: {
    workspaceRoot: join(__dirname, ".."),
  } as any,
};
