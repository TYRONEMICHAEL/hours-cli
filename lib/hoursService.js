import req from 'request';
import stampit from 'stampit';

const baseUrl = 'http://userservice.tangentmicroservices.com/';

const getAccessToken = function(username, password) {
  return new Promise((resolve, reject) => {
    req.post({
        url: baseUrl + 'api-token-auth/',
        form: {
          username: username,
          password: password
        }
      }, (err, res, body) => {
        if(err) return reject(err);
        resolve(body);
    });
  });
};

export default {
  getAccessToken: getAccessToken
};
