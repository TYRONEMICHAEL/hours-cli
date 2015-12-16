import req from 'request';
import stampit from 'stampit';
import callback from '../utils/callback';

const api = stampit.methods({
  getAccessToken() {
    const promise = new Promise((resolve, reject) => {
      const options = Object.assign({ uri: 'api-token-auth/' }, this.defaults);
      req.post(options, callback.bind(this, resolve, reject));
    });
    return promise;
  }
});

const init = stampit.init(function() {
  this.defaults = {
    json: true,
    baseUrl: 'http://userservice.tangentmicroservices.com/',
    formData: {
      username: this.username,
      password: this.password
    }
  };
  return this.getAccessToken();
});

export default stampit.compose(init, api);
