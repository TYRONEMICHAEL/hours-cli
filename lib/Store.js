import stampit from 'stampit';

const UserStore = {
  setUser(state, user) {
    return Object.assign({}, state, { user });
  }
};

const Store = stampit.init(function (instance) {
  let state = {};
  let reducers = {};

  this.stores.forEach((store) => {
    for (let func in store) {
      reducers[func] = store[func].bind(null, state);
    }
  });

  this.reducers = Object.keys(reducers);

  this.exec = function(func) {
    const params = Array.prototype.slice.call(arguments);
    state = reducers[func](...params.slice(1, params.length));
  };

  this.getState = function() {
    return state;
  };
});

const defaults = stampit.refs({
  stores: [UserStore]
});

export default stampit.compose(defaults, Store);
