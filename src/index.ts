import { codechecks } from "@codechecks/client";

import { BuildSizeWatcherOptions, FullArtifact, HistoryArtifact } from "./types";
import { getArtifactDiff } from "./getArtifactDiff";
import { getReportFromDiff, getChartData } from "./getReportFromDiff";
import { normalizeOptions } from "./normalization";
import { getArtifact } from "./getArtifact";
import { generateChart } from "./charts/generateChart";
import { dir } from "tmp-promise";
import { join } from "path";

export async function buildSizeWatcher(_options: BuildSizeWatcherOptions): Promise<void> {
  const options = normalizeOptions(_options);
  const cwd = codechecks.context.workspaceRoot;

  const fullArtifact = await getArtifact(options, cwd);

  await codechecks.saveValue(options.artifactName, fullArtifact);

  if (!codechecks.isPr()) {
    const historyArtifact =
      (await codechecks.getValue<HistoryArtifact>(
        options.historyArtifactName,
        codechecks.context.currentBranchName,
      )) || [];

    await codechecks.saveValue(
      options.historyArtifactName,
      currentHistoryArtifact(historyArtifact, fullArtifact),
      codechecks.context.currentBranchName,
    );
    //we could report here current size as well
    return;
  }

  const baseArtifact = await codechecks.getValue<FullArtifact>(options.artifactName);
  const baseHistoryArtifact =
    (await codechecks.getValue<HistoryArtifact>(
      options.historyArtifactName,
      codechecks.context.pr!.base.branchName,
    )) || [];

  const diff = getArtifactDiff(fullArtifact, baseArtifact);

  const { path: chartDir } = await dir();
  const chart1Path = join(chartDir, "/chart1.png");
  await generateChart(
    chart1Path,
    getChartData(currentHistoryArtifact(baseHistoryArtifact, fullArtifact)),
  );
  await codechecks.saveFile("chart1", chart1Path);
  const link = codechecks.getArtifactLink("chart1");

  const report = getReportFromDiff(diff, options.files, options);
  report.longDescription += `
  ## Charts
  ![example chart](${link})
  `;
  await codechecks.report(report);
}

export default buildSizeWatcher;

export function currentHistoryArtifact(
  historyArtifact: HistoryArtifact,
  artifact: FullArtifact,
): HistoryArtifact {
  return [{ hash: codechecks.context.currentSha, artifact }, ...historyArtifact];
}
