import GuestEmitter from '../guest-emitter';

describe('GuestEmitter', () => {
  it('supports publishing and subscribing to events', () => {
    const emitterA = new GuestEmitter();
    const emitterB = new GuestEmitter();

    const callback = sinon.stub();
    emitterB.subscribe('someEvent', callback);
    emitterA.publish('someEvent', 'foo', 'bar');

    assert.calledOnce(callback);
    assert.calledWith(callback, 'foo', 'bar');

    emitterB.unsubscribe('someEvent', callback);
    emitterA.publish('someEvent', 'foo', 'bar');

    assert.calledOnce(callback);
  });

  describe('#destroy', () => {
    it('removes all event subscriptions created by current instance', () => {
      const emitter = new GuestEmitter();
      const callback = sinon.stub();

      emitter.subscribe('someEvent', callback);
      emitter.publish('someEvent');
      assert.calledOnce(callback);

      emitter.destroy();
      emitter.publish('someEvent');
      assert.calledOnce(callback);
    });
  });
});
