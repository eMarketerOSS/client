import { normalizeURI } from '../url';

describe('annotator.util.url', () => {
  describe('normalizeURI', () => {
    it('resolves relative URLs against the provided base URI', () => {
      const base = 'http://example.com';
      assert.equal(normalizeURI('index.html', base), `${base}/index.html`);
    });

    it('resolves relative URLs against the document URI, if no base URI is provided', () => {
      // Strip filename from base URI.
      const base = document.baseURI.replace(/\/[^/]*$/, '');
      assert.equal(normalizeURI('foo.html'), `${base}/foo.html`);
    });

    it('does not modify absolute URIs', () => {
      const url = 'http://example.com/wibble';
      assert.equal(normalizeURI(url), url);
    });

    it('removes the fragment identifier', () => {
      const url = 'http://example.com/wibble#fragment';
      assert.equal(normalizeURI(url), 'http://example.com/wibble');
    });

    ['file:///Users/jane/article.pdf', 'doi:10.1234/4567'].forEach(url => {
      it('does not modify absolute non-HTTP/HTTPS URLs', () => {
        assert.equal(normalizeURI(url), url);
      });
    });

    it('removes superfluous query parameters from sharepoint documents', () => {
      const url =
        'https://anyold.sharepoint.com/sites/foo/bar.aspx?p=true&originalPath=/foo/bar/baz&e=123456&id=%2Fsites%2Ffoo%2FBar_Baz-Biz.pdf&parent=%2Fsites%2Ffoo';
      assert.equal(
        normalizeURI(url),
        'https://anyold.sharepoint.com/sites/foo/bar.aspx?id=%2Fsites%2Ffoo%2FBar_Baz-Biz.pdf&parent=%2Fsites%2Ffoo'
      );
    });

    it('alphabetically orders canonical query parameters from sharepoint documents', () => {
      const url =
        'https://anyold.sharepoint.com/sites/foo/bar.aspx?parent=%2Fsites%2Ffoo&id=%2Fsites%2Ffoo%2FBar_Baz-Biz.pdf';
      assert.equal(
        normalizeURI(url),
        'https://anyold.sharepoint.com/sites/foo/bar.aspx?id=%2Fsites%2Ffoo%2FBar_Baz-Biz.pdf&parent=%2Fsites%2Ffoo'
      );
    });

    it('does not modify non-sharepoint URIs', () => {
      const url = 'http://example.com/wibble?p=true';
      assert.equal(normalizeURI(url), url);
    });
  });
});
