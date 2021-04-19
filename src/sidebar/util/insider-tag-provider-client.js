import * as queryString from 'query-string';

/**
 * @typedef TagProviderAPIResponseQuery
 * @property {string} text - The text query sent to the API
 * @property {number} size - The number of tag suggestions requested from the API
 */

/**
 * @typedef TagProviderAPIResponseConcept
 * @property {string} label - The label of the tag
 * @property {string} scheme - The scheme or taxonomy where this tag lives
 * @property {string} uri - The canonical uri identifying this tag
 * @property {number} count - The number of times this tag has been used.
 * @property {number} updated - The timestamp when this tag was last used.
 */

/**
 * @typedef TagProviderAPIResponse
 * @property {TagProviderAPIResponseQuery} query - The query structure sent
 * @property {number} query_ms - The lookup time
 * @property {TagProviderAPIResponseConcept[]} concepts - The list of concepts found
 */

/**
 * TagProviderClient configuration.
 *
 * @typedef {Object} Config
 * @property {string} tagProviderUrl - Url for tag provider api endpoints
 * @property {string|undefined} tagSearchEndpoint - search endpoint
 * @property {string|undefined} tagSuggestEndpoint - suggest endpoint
 */

/**
 * TagProviderClient handles interaction with a tag provider endpoint
 */
export default class InsiderTagProviderClient {
  /**
   * Create a new TagProviderClient
   *
   * @param {Config} config
   */
  constructor(config) {
    this.tagProviderUrl = config.tagProviderUrl;
    this.tagSearchEndpoint = config.tagSearchEndpoint || '/search';
    this.tagSuggestEndpoint = config.tagSuggestEndpoint || '/suggest';
  }

  /**
   * Search for existing tags given a tag name or prefix
   *
   * @param {string} text - Tag name or prefix
   * @param {number|null} limit - Maximum number of results to return
   * @param {String[]|null} schemes - Limit to certain schemes / taxonomies
   * @returns {Promise<TagProviderAPIResponse>}
   */
  async search(text, limit, schemes) {
    const urlWithEndpoint = [
      this.tagProviderUrl.replace(/\/$/, ''),
      this.tagSearchEndpoint.replace(/^\//, ''),
    ].join('/');

    return this._get(
      urlWithEndpoint,
      Object.assign({ text }, limit && { limit }, schemes && { schemes })
    );
  }

  /**
   * Make an `application/json` GET request.
   *
   * @param {string} url
   * @param {object} data - Parameter dictionary
   */
  async _get(url, data) {
    const qs = queryString.stringify(data);
    const requestUrl = [url, qs].join('?');

    return fetch(requestUrl).then(response => {
      if (!response.ok) {
        throw new Error('HTTP error, status = ' + response.status);
      }
      return response.json();
    });
  }
}
