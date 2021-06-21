/**
 * Return a normalized version of a URI.
 *
 * This makes it absolute and strips the fragment identifier.
 *
 * @param {string} uri - Relative or absolute URL
 * @param {string} [base] - Base URL to resolve relative to. Defaults to
 *   the document's base URL.
 */
export function normalizeURIWithFragment(uri, base = document.baseURI) {
  const absUrl = new URL(uri, base).href;

  // Remove the fragment identifier.
  // This is done on the serialized URL rather than modifying `url.hash` due to
  // a bug in Safari.
  // See https://github.com/hypothesis/h/issues/3471#issuecomment-226713750
  return absUrl.toString().replace(/#.*/, '');
}

/**
 * Return a normalized version of a Sharepoint URI.
 *
 * There are multiple query parameters which track previous navigation and searches
 * which make it difficult to establish a canonical URI for a document.
 *
 * This function will remove all query parameters from a sharepoint document link
 * that are unnecessary for the canonical version (id and parent)
 *
 * @param {string} uri - Relative or absolute URL
 * @param {string} [base] - Base URL to resolve relative to. Defaults to
 *   the document's base URL.
 */
const normalizeUrl = require('normalize-url');

export function normalizeSharepointURI(uri, base = document.baseURI) {
  let absUrl = new URL(uri, base);

  if (absUrl.host.includes('.sharepoint.com')) {
    return normalizeUrl(absUrl.toString(), {
      sortQueryParameters: true,
      removeQueryParameters: ['e', 'p', 'q', 'originalPath', 'parentview'],
      stripAuthentication: true,
      stripHash: true,
      forceHttps: true,
      stripWWW: true,
      removeTrailingSlash: true,
      removeSingleSlash: true,
    });
  }

  return absUrl.toString();
}
