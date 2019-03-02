import { buildSize } from "../index";
import * as mockFS from "mock-fs";
import { join } from "path";

type Mocked<T> = { [k in keyof T]: jest.Mock<T[k]> };

describe("build-size", () => {
  // const getSizeMock = require("../getSize").getSize as jest.Mock<any>;
  // const superCiMock = require("../__mocks__/super-ci").superCI as Mocked<typeof superCI>;
  // beforeEach(() => jest.resetAllMocks());

  // it("should work when no baseline was found", async () => {
  //   getSizeMock.mockReturnValue(1024);
  //   superCiMock.isPr.mockReturnValue(true);

  //   const buildPath = "./build";
  //   await buildSize({ path: buildPath });

  //   expect(getSizeMock).toBeCalledWith(buildPath);
  //   expect(superCI.report).toBeCalledWith({
  //     name: "Build Size",
  //     shortDescription: `./build — 1KB (? +-)`,
  //   });
  // });

  // it("should work with baseline found", async () => {
  //   getSizeMock.mockReturnValue(1024);
  //   superCiMock.isPr.mockReturnValue(true);
  //   superCiMock.getValue.mockReturnValue(Promise.resolve(800));

  //   const buildPath = "./build";
  //   await buildSize({ path: buildPath });

  //   expect(getSizeMock).toBeCalledWith(buildPath);
  //   expect(getSizeMock).toBeCalledTimes(1);
  //   expect(superCI.report).toBeCalledWith({
  //     name: "Build Size",
  //     shortDescription: `./build — 1KB. Changed by 224B (28.00 %)`,
  //   });
  // });

  // it.skip("should work not in PR context", () => {});

  it("should work", async () => {
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
          name: "app",
          path: "build/main.*.js",
        },
      ],
    });

    mockFS.restore();
  });
});
