import * as fs from "fs";
import { promisify } from "bluebird";
const getFolderSize = require("get-folder-size");

export async function getSize(path: string): Promise<number> {
  const stat = fs.statSync(path);

  if (stat.isFile()) {
    return stat.size;
  } else {
    const fileSizePromisified = promisify<number, string>(getFolderSize);
    return await fileSizePromisified(path);
  }
}
