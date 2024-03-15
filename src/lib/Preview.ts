import MarkdownIt from "markdown-it";
import { UsePlugins } from "../markdownItPlugins/UsePlugins";

export const Preview = (md: MarkdownIt) => {
  UsePlugins(md);
  return md;
};
