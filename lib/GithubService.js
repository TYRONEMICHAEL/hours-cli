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

  getCommitsForBranch(repoName, branch) {
    const promise = new Promise((resolve, reject) => {
      const options = Object.assign({
        uri: `${repoName}/commits`,
        qs: {
          since: '2015-11-01',
          until: '2015-11-02',
          sha: branch,
          author: this.username
        }
      }, this.requestOptions);
      req.get(options, callback.bind(this, resolve, reject));
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
