import { buildSize } from "../index";
import * as mockFS from "mock-fs";
import { join } from "path";
import { codeChecks } from "codechecks";
import { FullArtifact } from "../types";

type Mocked<T> = { [k in keyof T]: jest.Mock<T[k]> };

describe("build-size", () => {
  const codeChecksMock = require("../__mocks__/codechecks").codeChecks as Mocked<typeof codeChecks>;
  beforeEach(() => jest.resetAllMocks());

  it("should work not in PR context", async () => {
    codeChecksMock.isPr.mockReturnValue(false);
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
    expect(codeChecks.report).toBeCalledTimes(0);
  });

  it("should work in PR context", async () => {
    codeChecksMock.isPr.mockReturnValue(true);
    codeChecksMock.getValue.mockReturnValue({
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
      gzip: false,
      files: [
        {
          path: "build/main.*.js",
        },
      ],
    });

    mockFS.restore();
    expect(codeChecks.report).toMatchInlineSnapshot(`
[MockFunction] {
  "calls": Array [
    Array [
      Object {
        "longDescription": "
  | Status | Files | Now | Diff | Max |
  |:------:|:-----:|:---:|:----:|:---:|
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

  it("should work in PR context without baseline", async () => {
    codeChecksMock.isPr.mockReturnValue(true);
    mockFS({
      [join(__dirname, "../build")]: {
        "main.12315123.js": "APP JS",
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
    expect(codeChecks.report).toMatchInlineSnapshot(`
[MockFunction] {
  "calls": Array [
    Array [
      Object {
        "longDescription": "
  | Status | Files | Now | Diff | Max |
  |:------:|:-----:|:---:|:----:|:---:|
  | new | build/main.*.js | 26B | +26B (+100.00%) |  —  |
  ",
        "name": "BuildSize",
        "shortDescription": "Total: 26B Change: +26B (+100.00%)",
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
