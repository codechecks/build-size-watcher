import { superCI } from "super-ci";
import { buildSize } from "../index";

jest.mock("../getSize.ts");

describe("build-size", () => {
  beforeEach(() => jest.resetAllMocks());

  it("should work when no baseline was found", async () => {
    const getSizeMock = require("../getSize").getSize as jest.Mock<any>;
    getSizeMock.mockReturnValue(1024);

    const buildPath = "./build";
    await buildSize({ path: buildPath });

    expect(getSizeMock).toBeCalledWith(buildPath);
    expect(superCI.report).toBeCalledWith("Build size: ./build — 1KB. Couldn't find previous build size");
  });

  it("should work with baseline found", async () => {
    const getSizeMock = require("../getSize").getSize as jest.Mock<any>;
    getSizeMock.mockReturnValue(1024);
    (superCI.getValue as jest.Mock<any>).mockReturnValue(Promise.resolve(800));

    const buildPath = "./build";
    await buildSize({ path: buildPath });

    expect(getSizeMock).toBeCalledWith(buildPath);
    expect(getSizeMock).toBeCalledTimes(1);
    expect(superCI.report).toBeCalledWith("Build size: ./build — 1KB. Changed by 224B (28.00 %)");
  });
});
