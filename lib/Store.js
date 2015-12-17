import stampit from 'stampit';
import userReducer from '../reducers/userReducer';
import projectReducer from '../reducers/projectReducer';

const Store = stampit.init(function (instance) {
  let state = {};
  let reducers = {};

  this.reducers.forEach((store) => {
    for (let func in store) {
      reducers[func] = store[func];
    }
  });

  this.exec = function(func) {
    const params = Array.prototype.slice.call(arguments);
    state = reducers[func](state, ...params.slice(1, params.length));
  };

  this.getState = function() {
    return Object.assign({}, state);
  };

  this.reducers = Object.keys(reducers);
});

const defaults = stampit.refs({
  reducers: [userReducer, projectReducer]
});

export default stampit.compose(defaults, Store);
