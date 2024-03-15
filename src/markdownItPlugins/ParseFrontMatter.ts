import MarkdownIt, { PluginWithParams } from "markdown-it";
import StateCore from "markdown-it/lib/rules_core/state_core";
import Token from "markdown-it/lib/token";
import MarkdownItFrontMatter from "markdown-it-front-matter";
import { FrontMatterType } from "../types";
import FrontMatterCss from "../css/FrontMatterCss";

export const ParseFrontMatter: PluginWithParams = (md: MarkdownIt) => {
  let frontMatter: FrontMatterType = {
    font_name: "",
    font_path: "",
    font_format: "",
    font_size: "16",
    background_image: "",
    text_color: "#000",
    text_stroke_size: "3",
    text_stroke_color: "#FFF",
    text_area_margin: "0",
    width: "1920",
    height: "1080",
    output_name: "",
    text_z_index: "",
    writing_mode: "horizontal-tb",
  };

  // front-matter
  // Get front-matter
  md.use(MarkdownItFrontMatter, (fm: string) => {
    const fmArray = fm.split("\n");
    fmArray.map((value) => {
      const splitArray = value.split(/:* /);
      const obj = { [splitArray[0]]: splitArray[1] };
      frontMatter = { ...frontMatter, ...obj };
    });
  });

  // section
  // hrごとにsectionで分割を行い、markdown全体の変換を行う
  // Convert the entire markdown by dividing each hr with a section.
  md.core.ruler.push("split_section", (state: StateCore) => {
    const tokens = state.tokens;

    // hr要素のindexを取得
    // Get index of hr element
    const hrIndexes = [];
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === "hr") {
        hrIndexes.push(i);
      }
    }

    // hr要素の数だけループ
    // Loop over a number of hr elements
    const svgOpen = new Token(
      "html_block_open",
      `svg viewBox="0 0 ${frontMatter.width} ${frontMatter.height}"`,
      1
    );
    const svgClose = new Token(`html_block_close`, "svg", -1);

    const foreignObjectOpen = new Token(
      "html_block_open",
      `foreignObject width="${frontMatter.width}" height="${frontMatter.height}"`,
      1
    );
    const foreignObjectClose = new Token(
      "html_block_close",
      "foreignObject",
      -1
    );

    let beforeIndex = 0;
    let newTokens: Token[] = [];

    // hr行とmarkdownの最下行ごとにsectionで区切る
    // Separate each hr line and the bottom line of markdown with a section
    [...hrIndexes, tokens.length - 1].forEach((hrIndex, index) => {
      const wrappedTokens = [
        svgOpen,
        foreignObjectOpen,
        new Token("html_block_open", `section id=${index}`, 1),
        ...tokens.slice(beforeIndex, hrIndex),
        new Token("html_block_close", "section", -1),
        foreignObjectClose,
        svgClose,
      ];
      newTokens = [...newTokens, ...wrappedTokens];

      //hrの後の列を保存
      beforeIndex = hrIndex + 1;
    });

    state.tokens = newTokens;
  });

  // custom_css
  // カスタムcssを挿入する
  // Insert custom_css
  md.core.ruler.push("custom_css", (state: StateCore) => {
    const metaContent = new Token("html_block", "", 0);
    metaContent.content = `<meta charset="utf-8">`;
    const styleContent = new Token("html_block", "", 0);
    styleContent.content = FrontMatterCss(frontMatter);
    state.tokens = [metaContent, styleContent, ...state.tokens];
  });
};
