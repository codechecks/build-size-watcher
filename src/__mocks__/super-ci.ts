import * as SuperCI from "super-ci";

export const superCI: Partial<typeof SuperCI.superCI> = {
  report: jest.fn(),
  getValue: jest.fn(),
  saveValue: jest.fn(),
  getCollection: jest.fn(),
  saveCollection: jest.fn(),
};
