import * as fs from "fs";
import gzipSize = require("gzip-size");

export async function getSize(path: string, gzip: boolean): Promise<number> {
  const stat = fs.statSync(path);

  if (!stat.isFile()) {
    throw new Error(`${path} is not a file!`);
  }

  if (gzip) {
    return gzipSize.file(path);
  } else {
    return stat.size;
  }
}
