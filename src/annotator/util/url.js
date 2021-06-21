/**
 * Return a normalized version of a URI.
 *
 * This makes it absolute and strips the fragment identifier.
 *
 * @param {string} uri - Relative or absolute URL
 * @param {string} [base] - Base URL to resolve relative to. Defaults to
 *   the document's base URL.
 */
import {
  normalizeSharepointURI,
  normalizeURIWithFragment,
} from './normalizers/uri';

export function normalizeURI(uri, base = document.baseURI) {
  const fragmentStripped = normalizeURIWithFragment(uri, base);
  const sharepointNormalized = normalizeSharepointURI(fragmentStripped, base);

  return sharepointNormalized;
}
