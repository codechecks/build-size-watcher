import { codechecks } from "@codechecks/client";

import { BuildSizeWatcherOptions, FullArtifact, HistoryArtifact } from "./types";
import { getArtifactDiff } from "./getArtifactDiff";
import { getReportFromDiff, getChartData } from "./getReportFromDiff";
import { normalizeOptions } from "./normalization";
import { getArtifact } from "./getArtifact";
import { generateChart } from "./charts/generateChart";

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
      [{ hash: codechecks.context.currentSha, artifact: fullArtifact }, ...historyArtifact],
      codechecks.context.currentBranchName,
    );
    //we could report here current size as well
    return;
  }

  const baseArtifact = await codechecks.getValue<FullArtifact>(options.artifactName);
  const baseHistoryArtifact =
    (await codechecks.getValue<HistoryArtifact>(
      options.artifactName,
      codechecks.context.pr!.base.sha,
    )) || [];

  const diff = getArtifactDiff(fullArtifact, baseArtifact);

  await generateChart("./charts/chart1.png", getChartData(baseHistoryArtifact));

  const report = getReportFromDiff(diff, options.files, options);
  await codechecks.report(report);
}

export default buildSizeWatcher;
