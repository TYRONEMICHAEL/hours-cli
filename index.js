import Vorpal from 'vorpal';
import config from './config';
import getDates from './utils/getDates';
import TokenService from './lib/TokenService';
import UserService from './lib/UserService';
import ProjectService from './lib/ProjectService';
import GithubService from './lib/GithubService';
import Store from './lib/Store';
import Logger from './lib/Logger';

let userService;
let projectService;

const store = Store();
const cli = new Vorpal();
const delimiter = 'hours-cli$';
const logger = Logger();
const projectToRepo = config.projectToRepo;
const repoNames = Object.keys(projectToRepo).map((key) => projectToRepo[key]);

const tokenService = TokenService({
  username: config.tangentUsername,
  password: config.tangentPassword
});

const githubService = GithubService({
  username: config.githubUsername,
  password: config.githubPassword
});

const getData = function () {
  logger.highlight(`Let us begin shall we...`);

  const promise = new Promise((resolve, reject) => {
    tokenService.then((data) => {
        const token = data.token;
        logger.showLoader('Logging you in...');
        userService = UserService({ token: token });
        projectService = ProjectService({ token: token });
        return userService.getUser();
      })
      .then((user) => {
        logger.stopLoader();
        store.exec('setUser', user);
        logger.success(`Logged in successfully. Welcome ${user.first_name}.`);
        logger.showLoader('Fetching your projects...');
        return projectService.getTasks(user.id);
      })
      .then((projects) => {
        let promiseArr = [];
        let state;

        logger.stopLoader();
        store.exec('setProjects', projects, projectToRepo);
        state = store.getState();
        logger.success(`We found and linked ${Object.keys(store.getState().projects).length} projects to your Github account.`);
        logger.showLoader('Fetching branches from Github...');
        repoNames.forEach((repo) => promiseArr.push(githubService.getBranchesForRepo(repo)));
        return Promise.all(promiseArr);
      })
      .then((repos) => {
        let promiseArr = [];

        logger.stopLoader();
        repos.forEach((branches, index) => {
          logger.success(`Found ${branches.length} branches for ${repoNames[index]}.`);
          branches.forEach((branch) => {
            promiseArr.push(githubService.getCommitsForBranch({
              repo: repoNames[index],
              branch: branch.name,
              from: config.from,
              until: config.until
            }));
          });
        });

        logger.showLoader('Fetching commits from branches...');
        return Promise.all(promiseArr);
      })
      .then((reposCommits) => {
        logger.stopLoader();
        reposCommits.forEach((repoCommits) => {
          let repo = repoCommits.repo;
          repoCommits.commits.forEach((commitObj) => {
            store.exec('addEntry', {
              repo,
              sha: commitObj.sha,
              message: commitObj.commit.message,
              date: commitObj.commit.committer.date,
              hours: config.hours
            });
          });
        });

        logger.highlight(`The following commits will be submitted for your hours:`);

        Object.keys(store.getState().entries).forEach((entryKey) => {
          let entry = store.getState().entries[entryKey];
          Object.keys(entry).forEach((key) => {
            let commit = entry[key];
            logger.log(`Project (${key}) for ${commit.hours} hours on ${entryKey}.`);
          });
        });

        resolve();
      })
      .catch(reject);
  });

  return promise;
};


cli
  .command('start', 'Start submitting your hours')
  .action(function(args, cb) {
    getData().then(() => {
      this.prompt({
        type: 'confirm',
        name: 'continue',
        default: false,
        message: 'Would you like to submit the following hours?',
      }, function(result){
        if (result.continue) {
          logger.highlight(`Starting the submission of your hours.`);
          cb();
        } else {
          logger.log('Canceled out of submission.');
          cb();
        }
      });
    }).catch((err) => {
      logger.stopLoader();
      logger.error(err);
    });
  });

cli
  .delimiter('hours-cli$:')
  .show()
  .log('Welcome to the Tangent Solutions CLI Hours Service.');

cli.exec('help');
