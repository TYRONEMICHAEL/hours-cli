import req from 'request';
import stampit from 'stampit';
import callback from '../utils/callback';

const api = stampit.methods({
  getUser() {
    const promise = new Promise((resolve, reject) => {
      const options = Object.assign({ uri: 'me/' }, this.requestOptions);
      req.get(options, callback.bind(this, resolve, reject));
    });
    return promise;
  }
});

const init = stampit.init(function () {
  this.requestOptions = {
    json: true,
    baseUrl: 'http://userservice.tangentmicroservices.com/api/v1/users/',
    headers: { 'Authorization': 'Token ' +  this.token }
  };
});

export default stampit.compose(init, api);
