import req from 'request';
import stampit from 'stampit';
import callback from '../utils/callback';

const api = stampit.methods({
  getBranchesForRepo(repoName) {
    const promise = new Promise((resolve, reject) => {
      const options = Object.assign({
        uri: `${repoName}/branches`
      }, this.requestOptions);
      req.get(options, callback.bind(this, resolve, reject));
    });
    return promise;
  },

  getCommitsForBranch(query) {
    const promise = new Promise((resolve, reject) => {
      const options = Object.assign({
        uri: `${query.repo}/commits`,
        qs: {
          since: new Date(query.from).toISOString(),
          until: new Date(query.until).toISOString(),
          sha: query.branch,
          author: this.username
        }
      }, this.requestOptions);
      req.get(options, (err, res, body) => {
        if(!err && res.statusCode === 200) {
          return resolve({
            repo: query.repo,
            commits: body
          });
        };
        return reject(err || body);
      });
    });
    return promise;
  }
});

const init = stampit.init(function () {
  this.requestOptions = {
    json: true,
    baseUrl: 'https://api.github.com/repos/tangentsolutions/',
    auth: {
      username: this.username,
      password: this.password
    },
    headers: {
      'User-Agent': this.username
    }
  };
});

export default stampit.compose(init, api);
