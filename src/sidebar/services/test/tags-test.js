import { TagsService } from '../tags';

let fakeTagProvider;
let fakeTagStore;
let sandbox;

describe('sidebar/services/tags', () => {
  let tags;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    fakeTagProvider = {
      filter: sinon.spy(),
    };

    fakeTagStore = {
      store: sinon.spy(),
    };

    tags = new TagsService(fakeTagProvider, fakeTagStore);
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('#filter', () => {
    it('delegates query call to tag-provider', async () => {
      let query = { text: 'pourquoi' };
      await tags.filter(query);
      return assert.calledWith(fakeTagProvider.filter, query);
    });

    it('delegates query call to tag-provider with sample context', async () => {
      let query = { text: 'pourquoi', context: { lang: 'fr' } };
      await tags.filter(query);
      return assert.calledWith(fakeTagProvider.filter, query);
    });
  });

  describe('#store', () => {
    it('delegates store call to tag-store', async () => {
      let theTags = [{ text: 'parce que' }];
      await tags.store(theTags);
      return assert.calledWith(fakeTagStore.store, theTags);
    });
  });
});
