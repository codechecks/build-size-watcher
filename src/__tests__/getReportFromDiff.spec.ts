import { getReportFromDiff } from "../getReportFromDiff";
import { FullArtifactDiff } from "../types";

describe("getReportFromDiff", () => {
  it("should work", async () => {
    const diff: FullArtifactDiff = {
      files: {
        app: {
          overallSize: 1024,
          sizeChange: 5,
          sizeChangeFraction: 0.004906771344455349,
          type: "changed",
        },
        css: {
          overallSize: 23,
          sizeChange: 23,
          sizeChangeFraction: 100,
          type: "new",
        },
        vendor: {
          overallSize: 0,
          sizeChange: -5043,
          sizeChangeFraction: -100,
          type: "deleted",
        },
      },
      totalSize: 1047,
      totalSizeChange: -5015,
      totalSizeChangeFraction: -0.8272847245133619,
    };
    expect(getReportFromDiff(diff)).toMatchInlineSnapshot(`
Object {
  "name": "BundleSize",
  "shortDescription": "Total: 1.02KB Change -4.9KB (-82.73%)",
}
`);
  });
});
