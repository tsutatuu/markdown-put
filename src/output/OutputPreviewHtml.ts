import { writeFileSync } from "fs";
import path from "path";

type Props = {
  markdown: string;
  outputPath: string;
};

// プレビューのhtmlを出力
// Output of preview html
export const OutputPreviewHtml = async ({ markdown, outputPath }: Props) => {
  const writePath = path.join(outputPath, "preview.html");
  await writeFileSync(writePath, markdown);
};
