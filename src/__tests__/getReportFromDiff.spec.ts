import { getReportFromDiff } from "../getReportFromDiff";
import { FullArtifactDiff } from "../types";

describe("getReportFromDiff", () => {
  it("should work with changed/new/deleted artifact", async () => {
    const diff: FullArtifactDiff = {
      files: {
        dapp: {
          overallSize: 1024,
          sizeChange: 5,
          sizeChangeFraction: 0.004906771344455349,
          type: "changed",
        },
        app: {
          overallSize: 10,
          sizeChange: 1,
          sizeChangeFraction: 0.1,
          type: "changed",
        },
        css: {
          overallSize: 23,
          sizeChange: 23,
          sizeChangeFraction: 1,
          type: "new",
        },
        vendor: {
          overallSize: 0,
          sizeChange: -5043,
          sizeChangeFraction: -1,
          type: "deleted",
        },
      },
      totalSize: 1047,
      totalSizeChange: -5015,
      totalSizeChangeFraction: -0.8272847245133619,
    };
    expect(getReportFromDiff(diff, [])).toMatchInlineSnapshot(`
Object {
  "longDescription": "
  | Status | Files | Now | Diff | Max |
  | ------ | ----- | --- | ---- | --- |
  | changed | app | 10B | +1B (+10.00%) |  —  |
| changed | dapp | 1KB | +5B (+0.49%) |  —  |
| new | css | 23B | +23B (+100.00%) |  —  |
| deleted | vendor | 0B | -4.92KB (-100.00%) |  —  |
  ",
  "name": "BuildSize",
  "shortDescription": "Total: 1.02KB Change: -4.9KB (-82.73%)",
  "status": "success",
}
`);
  });

  it("should work with new artifact", async () => {
    const diff: FullArtifactDiff = {
      files: {
        css: {
          overallSize: 23,
          sizeChange: 23,
          sizeChangeFraction: 1,
          type: "new",
        },
      },
      totalSize: 1047,
      totalSizeChange: 1047,
      totalSizeChangeFraction: 1,
    };
    expect(getReportFromDiff(diff, [])).toMatchInlineSnapshot(`
Object {
  "longDescription": "
  | Status | Files | Now | Diff | Max |
  | ------ | ----- | --- | ---- | --- |
  | new | css | 23B | +23B (+100.00%) |  —  |
  ",
  "name": "BuildSize",
  "shortDescription": "Total: 1.02KB Change: +1.02KB (+100.00%)",
  "status": "success",
}
`);
  });

  it("should work with reached max size", async () => {
    const diff: FullArtifactDiff = {
      files: {
        "*.css": {
          overallSize: 23,
          sizeChange: 23,
          sizeChangeFraction: 1,
          type: "new",
        },
      },
      totalSize: 1047,
      totalSizeChange: 1047,
      totalSizeChangeFraction: 1,
    };
    expect(getReportFromDiff(diff, [{ path: "*.css", maxSize: 10 }])).toMatchInlineSnapshot(`
Object {
  "longDescription": "
  | Status | Files | Now | Diff | Max |
  | ------ | ----- | --- | ---- | --- |
  | 🛑 Max size reached | *.css | 23B | +23B (+100.00%) | 10B |
  ",
  "name": "BuildSize",
  "shortDescription": "Total: 1.02KB Change: +1.02KB (+100.00%)",
  "status": "fail",
}
`);
  });
});
