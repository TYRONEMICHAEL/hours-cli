import req from 'request';
import stampit from 'stampit';
import callback from '../utils/callback';

const api = stampit.methods({
  addEntry(entry) {
    const promise = new Promise((resolve, reject) => {
      const options = Object.assign({
        uri: 'entry/',
        form: entry
      }, this.defaults);

      req.post(options, callback.bind(this, resolve, reject));
    });
    return promise;
  }
});

const init = stampit.init(function() {
  this.defaults = {
    json: true,
    baseUrl: 'http://hoursservice.tangentmicroservices.com/api/v1/',
    headers: { 'Authorization': 'Token ' +  this.token }
  };
});

export default stampit.compose(init, api);
