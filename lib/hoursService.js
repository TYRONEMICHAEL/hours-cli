import req from 'request';
import stampit from 'stampit';

const HoursService = stampit.refs({
    username: '',
    password: '',
    baseUrl: 'http://userservice.tangentmicroservices.com/'
  }).methods({
    getAccessToken() {
      const promise = new Promise((resolve, reject) => {
        req.post({
            url: this.baseUrl + 'api-token-auth/',
            json: true,
            form: {
              username: this.username,
              password: this.password
            }
          }, (err, res, body) => {
            if(!err && res.statusCode === 200) resolve(body);
            reject(err || body);
        });
      });

      promise.then((body) => this.token = JSON.parse(body).token);
      promise.catch(() => this.token = '');
      return promise;
    }
  }).init(function() {
    return this.getAccessToken();
  });

export default HoursService;
