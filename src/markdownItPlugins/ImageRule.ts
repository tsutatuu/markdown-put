import MarkdownIt, { PluginWithParams } from "markdown-it";
import Token from "markdown-it/lib/token";

export const ImageRule: PluginWithParams = (md: MarkdownIt) => {
  md.renderer.rules.image = (tokens: Token[], idx: number) => {
    const token = tokens[idx];
    if (token.type === "image" && token.attrs) {
      const src = token.attrs.find((attr) => attr[0] === "src");
      const srcText = src ? src[1] : "";
      return `<img class="character_image" style="position:fixed; background-color: transparent; max-width: 100%; max-height: 100%; ${token.content}" src="${srcText}" >`;
    } else {
      return "";
    }
  };
};
