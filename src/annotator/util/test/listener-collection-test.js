import { ListenerCollection } from '../../util/listener-collection';

describe('ListenerCollection', () => {
  let listeners;

  beforeEach(() => {
    listeners = new ListenerCollection();
  });

  afterEach(() => {
    listeners.removeAll();
  });

  it('registers and triggers event listener', () => {
    const listener = sinon.stub();
    listeners.add(window, 'resize', listener);

    window.dispatchEvent(new Event('resize'));
    assert.calledOnce(listener);
  });

  it('unregister event listeners', () => {
    const listener = sinon.stub();
    listeners.add(window, 'resize', listener);
    listeners.removeAll();

    window.dispatchEvent(new Event('resize'));
    assert.notCalled(listener);
  });
});
