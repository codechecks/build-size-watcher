import { buildSize } from "../index";
import * as mockFS from "mock-fs";
import { join } from "path";
import { superCI } from "super-ci";
import { FullArtifact } from "../types";

type Mocked<T> = { [k in keyof T]: jest.Mock<T[k]> };

describe("build-size", () => {
  const superCiMock = require("../__mocks__/super-ci").superCI as Mocked<typeof superCI>;
  beforeEach(() => jest.resetAllMocks());

  it("should work not in PR context", async () => {
    superCiMock.isPr.mockReturnValue(false);
    mockFS({
      [join(__dirname, "../build")]: {
        "main.12315123.js": "APP JS",
        "vendor.123124.js": "VENDOR JS",
        "vendor.12466345.css": "VENDOR CSS",
      },
    });

    await buildSize({
      files: [
        {
          path: "build/main.*.js",
        },
      ],
    });

    mockFS.restore();
    expect(superCI.report).toBeCalledTimes(0);
  });

  it("should work in PR context", async () => {
    superCiMock.isPr.mockReturnValue(true);
    superCiMock.getValue.mockReturnValue({
      "build/main.*.js": {
        name: "app",
        files: 1,
        overallSize: 10,
        path: "build/main.*.js",
      },
    } as FullArtifact);
    mockFS({
      [join(__dirname, "../build")]: {
        "main.12315123.js": "APP JS",
        "vendor.123124.js": "VENDOR JS",
        "vendor.12466345.css": "VENDOR CSS",
      },
    });

    await buildSize({
      files: [
        {
          path: "build/main.*.js",
        },
      ],
    });

    mockFS.restore();
    expect(superCI.report).toMatchInlineSnapshot(`
[MockFunction] {
  "calls": Array [
    Array [
      Object {
        "longDescription": "
  | Status | Files | Now | Diff | Max |
  | ------ | ----- | --- | ---- | --- |
  | changed | build/main.*.js | 6B | -4B (-40.00%) |  —  |
  ",
        "name": "BuildSize",
        "shortDescription": "Total: 6B Change: -4B (-40.00%)",
        "status": "success",
      },
    ],
  ],
  "results": Array [
    Object {
      "isThrow": false,
      "value": undefined,
    },
  ],
}
`);
  });
});
