import { getArtifactDiff } from "../getArtifactDiff";
import { FullArtifact } from "../types";

describe("getArtifactDiff", () => {
  it("should work", async () => {
    const A: FullArtifact = {
      app: {
        name: "app",
        files: 1,
        overallSize: 1024,
        path: "./build/app.*.js",
      },
      css: {
        name: "css",
        files: 2,
        overallSize: 23,
        path: "./build/*.css",
      },
    };

    const B: FullArtifact = {
      app: {
        name: "app",
        files: 1,
        overallSize: 1019,
        path: "./build/app.*.js",
      },
      vendor: {
        name: "vendor",
        files: 2,
        overallSize: 5043,
        path: "./build/vendor.*.js",
      },
    };

    const actualDiff = getArtifactDiff(A, B);
    expect(actualDiff).toMatchInlineSnapshot(`
Object {
  "files": Object {
    "app": Object {
      "overallSize": 1024,
      "sizeChange": 5,
      "sizeChangeFraction": 0.004906771344455349,
      "type": "changed",
    },
    "css": Object {
      "overallSize": 23,
      "sizeChange": 23,
      "sizeChangeFraction": 100,
      "type": "new",
    },
    "vendor": Object {
      "overallSize": 0,
      "sizeChange": -5043,
      "sizeChangeFraction": -100,
      "type": "deleted",
    },
  },
  "totalSize": 1047,
  "totalSizeChange": -5015,
  "totalSizeChangeFraction": -0.8272847245133619,
}
`);
  });
});
