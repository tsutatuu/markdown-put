import { readFileSync } from "fs";
import MarkdownIt from "markdown-it";
import yargs from "yargs";
import path from "path";
import { OutputPreviewHtml } from "../output/OutputPreviewHtml";
import { UsePlugins } from "../markdownItPlugins/UsePlugins";
import { OutputImages } from "../output/OutputImages";
import ParseGrayMatter from "../grayMatter/ParseGrayMatter";

const main = async () => {
  let isPreview = false;
  const argv = yargs
    .option("preview", {
      describe: "Output preview html instead of images",
      type: "boolean",
      default: false,
    })
    .option("md", {
      describe: "Path of markdown file",
      type: "string",
      demandOption: true,
    })
    .parseSync();

  if (argv.preview) {
    isPreview = true;
  }

  const md = new MarkdownIt();
  UsePlugins(md);

  const dirPath = path.dirname(argv.md);

  const file = await readFileSync(argv.md, "utf-8");
  const renderedHtml = md.render(file);

  if (isPreview) {
    await OutputPreviewHtml({ markdown: renderedHtml, outputPath: dirPath });
  } else {
    // 絶対パスの作成
    // Creating absolute paths
    const absDirPath = process.cwd() + "/" + dirPath;

    const { imageSize, outputName } = ParseGrayMatter(file);

    await OutputImages({
      html: renderedHtml,
      dirPath: absDirPath,
      imageSize,
      outputName,
    });
  }
};

main();
