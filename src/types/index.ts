// font-face
// https://developer.mozilla.org/ja/docs/Web/CSS/@font-face
export type fontType = {
  font_name: string;
  font_path: string;
  font_format: string;
};

export type FrontMatterType = fontType & {
  font_size: string;
  background_image: string;
  text_color: string;
  text_stroke_size: string;
  text_stroke_color: string;
  text_area_margin: string;
  width: string;
  height: string;
  output_name: string;
  text_z_index: string;
  writing_mode: string;
};

export type ImageSizeType = {
  width: number;
  height: number;
};
