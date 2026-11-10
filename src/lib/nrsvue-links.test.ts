import { describe, it, expect } from "vitest";
import { nrsvueLinks } from "./nrsvue-links";

const BG = "https://www.biblegateway.com/passage/?search=";

describe("nrsvueLinks", () => {
  it("switches NRSV links to NRSVUE", () => {
    expect(nrsvueLinks(`<a href="${BG}Luke+3%3A7-18&amp;version=NRSV">x</a>`)).toBe(
      `<a href="${BG}Luke+3%3A7-18&amp;version=NRSVUE">x</a>`,
    );
  });

  it("drops NRSV footnote anchors, which don't exist in NRSVUE", () => {
    expect(nrsvueLinks(`<a href="${BG}Romans+8&amp;version=NRSV#fen-NRSV-23573a">x</a>`)).toBe(
      `<a href="${BG}Romans+8&amp;version=NRSVUE">x</a>`,
    );
  });

  it("adds the version when a link has none", () => {
    expect(nrsvueLinks(`<a href="${BG}Psalm%20127;Mark%2012:38-44">x</a>`)).toBe(
      `<a href="${BG}Psalm%20127;Mark%2012:38-44&amp;version=NRSVUE">x</a>`,
    );
  });

  it("fixes the broken John 17 reference", () => {
    expect(nrsvueLinks(`<a href="${BG}Psalm%201;John%2017:6-190;src=link">x</a>`)).toBe(
      `<a href="${BG}Psalm%201;John%2017:6-19&amp;version=NRSVUE">x</a>`,
    );
  });

  it("leaves other versions and other sites alone", () => {
    const html = `<a href="${BG}John+3&amp;version=NRSVCE">a</a><a href="https://example.com/?version=NRSV">b</a>`;
    expect(nrsvueLinks(html)).toBe(html);
  });
});
