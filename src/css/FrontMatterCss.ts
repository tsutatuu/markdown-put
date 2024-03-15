import { FrontMatterType } from "../types";

const FrontMatterCss = (frontMatter: FrontMatterType) => {
  const {
    font_name,
    font_path,
    font_format,
    font_size,
    background_image,
    text_color,
    text_stroke_size,
    text_stroke_color,
    text_area_margin,
    width,
    height,
    text_z_index,
    writing_mode,
  } = frontMatter;

  const css = `
<style>
    ${
      font_name &&
      font_path &&
      font_format &&
      `
        @font-face{
        font-family: "${font_name}";
        src:url(${font_path}) format("${font_format}");
    }`
    }

    
    * {
        margin: 0;
        padding: 0;
        font-family: "${font_name}";
    }


    section > div.text_area {
        font-size: ${font_size};
        color: ${text_color};
        text-shadow:${text_stroke_size} ${text_stroke_size} 0 ${text_stroke_color}, -${text_stroke_size} -${text_stroke_size} 0 ${text_stroke_color},
        -${text_stroke_size} ${text_stroke_size} 0 ${text_stroke_color}, ${text_stroke_size} -${text_stroke_size} 0 ${text_stroke_color},
        0px ${text_stroke_size} 0 ${text_stroke_color},  0-${text_stroke_size} 0 ${text_stroke_color},
        -${text_stroke_size} 0 0 ${text_stroke_color}, ${text_stroke_size} 0 0 ${text_stroke_color};
        margin: ${text_area_margin};
        z-index: ${text_z_index};
        writing-mode: ${writing_mode};
        position: absolute;
        right: 0;
    }

    section > div.image_area {
        width:${width}px;
        height:${height}px;
        position: absolute;
    }

    section {
        width:${width}px;
        height:${height}px;
        ${background_image && `background-image: url(${background_image});`}
        background-size:cover;
        background-position: center center;
        overflow:hidden;
    }
</style>
`;

  return css;
};

export default FrontMatterCss;
