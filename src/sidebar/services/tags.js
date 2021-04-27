/**
 * @typedef Tag
 * @property {string} text - The label of the tag
 * @property {number} count - The number of times this tag has been used.
 * @property {number} updated - The timestamp when this tag was last used.
 */

/**
 * @typedef TagQuery
 * @property {string} text - The text entered in the tag editor
 * @property [object] context - Optional context object.
 */

/**
 * Service for fetching tag suggestions from a tagProvider service
 * and optionally storing data to generate them.
 *
 * The injected `tagProvider` service needs to provide `filter` method to
 * fetch tag suggestions matching a query and optional context object.
 *
 * The injected `tagStore` service needs to provide a `store`
 * method to store entered tags.
 */
// @inject
export class TagsService {
  /**
   * @param tagProvider - TagProvider implementation
   * @param tagStore - TagStore implementation
   */
  constructor(tagProvider, tagStore) {
    this._provider = tagProvider;
    this._store = tagStore;
  }

  /**
   * Return a list of tag suggestions matching `query`.
   *
   * @async
   * @param {TagQuery} query
   * @param [limit] number - Optional limit of the results.
   * @return {Promise<Tag[]>} List of matching tags
   */
  async filter(query, limit = null) {
    return this._provider.filter(query, limit);
  }

  /**
   * Update the list of stored tag suggestions based on the tags that a user has
   * entered for a given annotation.
   *
   * @async
   * @param {Tag[]} tags - List of tags.
   * @return {Promise}
   */
  async store(tags) {
    return this._store.store(tags);
  }
}