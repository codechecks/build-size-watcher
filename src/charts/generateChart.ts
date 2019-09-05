import * as vega from "vega";
import * as fs from "fs";

import * as chartDefinition from "./vega-spec.json";

interface DataPoint {
  x: string;
  y: number;
}

export async function generateChart(path: string, dataPoints: DataPoint[]): Promise<void> {
  const wrappedDataPoints = [
    {
      name: "main",
      values: dataPoints.map(dp => ({ ...dp, c: 0 })),
    },
  ];
  const finalChartDef: any = {
    ...chartDefinition,
    data: wrappedDataPoints,
  };

  const view = new vega.View(vega.parse(finalChartDef), { renderer: "none" }).initialize();

  const canvas = await view.toCanvas();

  fs.writeFileSync(path, canvas.toBuffer());
}
