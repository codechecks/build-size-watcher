import { superCI } from "super-ci";
import * as bytes from "bytes";

import { BuildSizeOptions } from "./types";
import { getSize } from "./getSize";

export async function buildSize(options: BuildSizeOptions): Promise<void> {
  const currentSize = await getSize(options.path);

  await superCI.saveValue("build-size", currentSize);

  if (superCI.isPr()) {
    const baseSize = await superCI.getValue<number>("build-size");

    if (!baseSize) {
      superCI.report({
        name: "Build Size",
        shortDescription: `${options.path} — ${bytes(currentSize)} (? +-)`,
      });
      return;
    }

    const changeSize = currentSize - baseSize;
    const changeSizePercentage = (changeSize / baseSize) * 100;

    superCI.report({
      name: "Build Size",
      shortDescription: `${options.path} — ${bytes(currentSize)}. Changed by ${bytes(
        changeSize,
      )} (${changeSizePercentage.toFixed(2)} %)`,
    });
  }
}
