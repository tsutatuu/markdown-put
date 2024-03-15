import MarkdownIt from "markdown-it";
import MarkdownItContainer from "markdown-it-container";
import Token from "markdown-it/lib/token";
import { ImageRule } from "./ImageRule";
import { ParseFrontMatter } from "./ParseFrontMatter";

export const UsePlugins = (md: MarkdownIt) => {
  md.use(ParseFrontMatter);

  // image_area
  md.use(MarkdownItContainer, "image", {
    render: (tokens: Token[], idx: number) => {
      const token = tokens[idx];
      const styles = token.info.trim().match(/^image$/);
      if (token.nesting === 1 && styles) {
        return `<div class="image_area">`;
      } else {
        return `</div>`;
      }
    },
  });

  // text_area
  md.use(MarkdownItContainer, "text", {
    render: (tokens: Token[], idx: number) => {
      const token = tokens[idx];
      const styles = token.info.trim().match(/^text$/);
      if (token.nesting === 1 && styles) {
        return `<div class="text_area">`;
      } else {
        return `</div>`;
      }
    },
  });

  // image
  md.use(ImageRule);
};
