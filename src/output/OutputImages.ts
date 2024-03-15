import puppeteer from "puppeteer";
import { JSDOM } from "jsdom";
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs";
import path from "path";
import { ImageSizeType } from "../types";

type Props = {
  html: string;
  dirPath: string;
  imageSize: ImageSizeType;
  outputName?: string;
};

export const OutputImages = async ({
  html,
  dirPath,
  imageSize,
  outputName,
}: Props) => {
  // フォルダ作成
  // Create folder
  const outputPath = path.join(dirPath, "output");
  if (!existsSync(outputPath)) {
    mkdirSync(outputPath);
  }

  // previewの出力（デバッグ用）
  // Output of preview (for debugging)
  // OutputPreviewHtml({ markdown: html, outputPath: dirPath });

  // htmlの解析
  // Parsing html
  const dom = new JSDOM(html);
  const sections = dom.window.document.querySelectorAll("section");
  const styleElement = dom.window.document.querySelector("style");

  // width及びheightを取得
  // TODO: {width:19200, height:14400}のように大きすぎる画像の場合、出力結果が画像の読み込みが終わってない状態でスクリーンショットされるので修正する
  // TODO: Fix the output result of an image that is too large, such as {width:19200, height:14400}, as it will be screenshot with the image not finished loading.
  const { width, height } = imageSize;

  // sectionごとにスクリーンショットを作成
  // Create screenshots for each section
  for (const [index, section] of sections.entries()) {
    const sectionHtml = `
  <html>
  <head>
  <meta charset="UTF-8">
  ${styleElement?.outerHTML}
  </head>
  <body>
  <svg viewBox="0 0 ${width} ${height}">
  <foreignObject width="${width}" height="${height}">
  ${section.outerHTML}
  </foreignObject>
  </svg>
  </body>
  </html>`;

    // htmlを出力
    // Output of html
    const writeHtmlPath = path.join(dirPath, `page_${index}.html`);
    await writeFileSync(writeHtmlPath, sectionHtml);

    // puppeteerの起動
    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: { width, height },
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setDefaultTimeout(0);

    await page.goto(`file://${writeHtmlPath}`, { waitUntil: "networkidle0" });

    if (outputName) {
      // 名称指定がある場合は名称フォルダに出力
      // Output to name folder if name is specified
      const filePath = path.join(outputPath, outputName);
      if (!existsSync(filePath)) {
        mkdirSync(filePath);
      }
      const writeImagePath = path.join(
        filePath,
        `${outputName ? outputName : "page"}_${index}.png`
      );
      await page.screenshot({
        type: "png",
        path: writeImagePath,
      });
    } else {
      // outputに直接出力
      const writeImagePath = path.join(outputPath, `page_${index}.png`);
      await page.screenshot({
        type: "png",
        path: writeImagePath,
      });
    }

    // puppeteerの終了
    // Exit puppeteer
    await browser.close();

    // 不要になったhtmlを削除
    // Delete html that is no longer needed
    await unlinkSync(writeHtmlPath);
  }
};
