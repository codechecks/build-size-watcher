import * as vega from "vega";
import * as fs from "fs";

const chartDefinition = require("./vega-spec.json");

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
  chartDefinition.data = wrappedDataPoints;

  const view = new vega.View(vega.parse(chartDefinition), { renderer: "none" }).initialize();

  const canvas = await view.toCanvas();

  fs.writeFileSync(path, canvas.toBuffer());
}
