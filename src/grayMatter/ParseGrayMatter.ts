import matter from "gray-matter";
import { ImageSizeType } from "../types";

type ParseGrayMatterType = {
  imageSize: ImageSizeType;
  outputName: string;
};

const ParseGrayMatter = (text: string): ParseGrayMatterType => {
  const { data } = matter(text);
  const outputName = data.output_name;
  const width = data.width;
  const height = data.height;

  return { imageSize: { width, height }, outputName };
};

export default ParseGrayMatter;
