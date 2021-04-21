import InsiderTagProviderClient from '../util/insider-tag-provider-client';

/** @typedef {import('./tags').Tag} Tag */
/** @typedef {import('./tags').TagQuery} TagQuery */
/** @typedef {import('../util/insider-tag-provider-client').TagProviderAPIResponse} TagProviderAPIResponse */

/**
 * Service for fetching tag suggestions from a remote endpoint
 */
// @inject
export class RemoteTagProviderService {
  constructor(settings) {
    this._tagProviderClient = new InsiderTagProviderClient(settings);
  }

  /**
   * Return a list of tag suggestions matching `query`.
   *
   * @async
   * @param {TagQuery} query
   * @param {number|null} limit - Optional limit of the results.
   * @return {Promise<Tag[]|null>} List of matching tags
   */
  async filter(query, limit = null) {
    if (!this._tagProviderClient) {
      return Promise.resolve(null);
    }

    if (!query || !('text' in query) || query.text.trim() === '') {
      return Promise.resolve(null);
    }

    // query will match tag if:
    // * tag starts with query (e.g. tag "banana" matches query "ban"), OR
    // * any word in the tag starts with query
    //   (e.g. tag "pink banana" matches query "ban"), OR
    // * tag has substring query occurring after a non-word character
    //   (e.g. tag "pink!banana" matches query "ban") (TODO: update index analyzer)

    // TODO: (does this timeout? ... fall back to local-storage? - caller concern?)
    const resp = await this._tagProviderClient.search(
      query.text.toLowerCase(),
      limit,
      null
    );

    return RemoteTagProviderService.unpackResponseToTagArray(resp);
  }

  /**
   * unpackResponseToTagArray
   *
   * @param {TagProviderAPIResponse} data
   * @returns {Tag[]}
   */
  static unpackResponseToTagArray(data) {
    const { /* query, query_ms,*/ concepts } = data;
    return concepts.map(RemoteTagProviderService.unpackConceptToTag);
  }

  /**
   * unpackConceptToTag
   *
   * @param concept
   * @returns {Tag}
   */
  static unpackConceptToTag(concept) {
    return {
      text: concept?.label,
      scope: concept?.scheme,
      count: concept?.count,
      updated: concept?.updated,
    };
  }
}
