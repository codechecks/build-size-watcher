import { superCI } from "super-ci";
import { buildSize } from "../index";

type Mocked<T> = { [k in keyof T]: jest.Mock<T[k]> };

jest.mock("../getSize.ts");

describe("build-size", () => {
  const getSizeMock = require("../getSize").getSize as jest.Mock<any>;
  const superCiMock = require("../__mocks__/super-ci").superCI as Mocked<typeof superCI>;
  beforeEach(() => jest.resetAllMocks());

  it("should work when no baseline was found", async () => {
    getSizeMock.mockReturnValue(1024);
    superCiMock.isPr.mockReturnValue(true);

    const buildPath = "./build";
    await buildSize({ path: buildPath });

    expect(getSizeMock).toBeCalledWith(buildPath);
    expect(superCI.report).toBeCalledWith("Build size: ./build — 1KB. Couldn't find previous build size");
  });

  it("should work with baseline found", async () => {
    getSizeMock.mockReturnValue(1024);
    superCiMock.isPr.mockReturnValue(true);
    superCiMock.getValue.mockReturnValue(Promise.resolve(800));

    const buildPath = "./build";
    await buildSize({ path: buildPath });

    expect(getSizeMock).toBeCalledWith(buildPath);
    expect(getSizeMock).toBeCalledTimes(1);
    expect(superCI.report).toBeCalledWith("Build size: ./build — 1KB. Changed by 224B (28.00 %)");
  });

  it.skip("should work not in PR context");
});
