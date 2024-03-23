import MarkdownIt, { PluginWithParams } from "markdown-it";
import Token from "markdown-it/lib/token";

export const DakutenRule: PluginWithParams = (md: MarkdownIt) => {
    md.renderer.rules.text = (tokens: Token[], idx: number) => {
        const token = tokens[idx];
        const regex = /(.)(゛)/g;
        const replaced = token.content.replace(regex, (_match, p1) => {
            return `<span class="dakuten">${p1}</span>`;
        });
        return replaced;
    };
};
