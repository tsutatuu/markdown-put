import MarkdownIt from "markdown-it";
import { UsePlugins } from "../markdownItPlugins/UsePlugins";
import { OutputImages } from "../output/OutputImages";
import ParseGrayMatter from "../grayMatter/ParseGrayMatter";

export const Output = async (mdText: string, outputPath: string) => {
  const md = new MarkdownIt({ html: true });
  UsePlugins(md);
  const renderedHtml = md.render(mdText);
  
  const { imageSize, outputName } = ParseGrayMatter(mdText);

  await OutputImages({
    html: renderedHtml,
    dirPath: outputPath,
    imageSize,
    outputName,
  });
};
