import req from 'request';
import stampit from 'stampit';

const baseUrl = 'http://userservice.tangentmicroservices.com/';
const callback = (resolve, reject, err, res, body) => {
  if(!err && res.statusCode === 200) resolve(body);
  reject(err || body);
};

const HoursService = stampit.refs({
    username: '',
    password: '',
    baseUrl: baseUrl
  }).methods({
    getAccessToken() {
      const promise = new Promise((resolve, reject) => {
        const options = Object.assign({ uri: 'api-token-auth/' }, this.defaults);
        req.post(options, callback.bind(this, resolve, reject));
      });
      promise.then((body) => this.defaults.token = body.token);
      return promise;
    }
  }).init(function() {
    this.defaults = {
      json: true,
      baseUrl: this.baseUrl,
      formData: {
        username: this.username,
        password: this.password
      }
    };

    return this.getAccessToken();
  });

export default HoursService;
