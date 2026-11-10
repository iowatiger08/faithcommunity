/**
 * Point the BibleGateway links inside older post bodies at the NRSVUE.
 * Run by sync-content so posts.json stays a faithful copy of Blogger.
 */
const PASSAGE_HREF = /href="(https:\/\/www\.biblegateway\.com\/passage\/\?[^"#]*)(#[^"]*)?"/g;

export function nrsvueLinks(html: string): string {
  return html.replace(PASSAGE_HREF, (match, url: string) => {
    // One post's link has a typo that BibleGateway can't read.
    const fixed = url.replace("John%2017:6-190;src=link", "John%2017:6-19");
    if (/version=NRSV(?![A-Z])/.test(fixed)) {
      return `href="${fixed.replace(/version=NRSV(?![A-Z])/, "version=NRSVUE")}"`;
    }
    if (/version=/.test(fixed)) return match;
    return `href="${fixed}&amp;version=NRSVUE"`;
  });
}
