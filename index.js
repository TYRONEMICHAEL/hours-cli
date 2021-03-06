import Vorpal from 'vorpal';
import config from './config';
import getDates from './utils/getDates';
import TokenService from './lib/TokenService';
import UserService from './lib/UserService';
import ProjectService from './lib/ProjectService';
import GithubService from './lib/GithubService';
import HourService from './lib/HourService';
import Store from './lib/Store';
import Logger from './lib/Logger';

let userService;
let projectService;
let hourService;

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
        hourService = HourService({ token: token });
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
              until: config.to
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
              hours: config.defaultHours
            });
          });
        });

        logger.highlight(`The following commits will be submitted for your hours:`);

        if(!store.getState().entries) {
          return reject('No entries found to submit. Exiting.');
        }

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

const submitData = function(entries) {
  let promiseArr = [];

  Object.keys(entries).forEach((key) => {
    Object.keys(entries[key]).forEach((projectKey) => {
      promiseArr.push(hourService.addEntry(entries[key][projectKey]));
    });
  });

  return Promise.all(promiseArr);
};

// Comment this out when deving & can call getData() directly instead.
// Otherwise the REPL will not exit properly and still run in the bg.
cli
  .command('start', 'Start capturing your hours')
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
          logger.showLoader('Submitting your hours...');

          return submitData(store.getState().entries)
            .then((res) => {
              logger.stopLoader();
              logger.success(`Submitted ${res.length} entries.`);
              cb();
            })
            .catch((err) => {
              logger.stopLoader();
              logger.error(err);
              cb();
            });
        }

        logger.log('Canceled out of submission.');
        return cb();
      });
    }).catch((err) => {
      logger.stopLoader();
      logger.error(err);
      cb();
    });
  });

cli
  .command('submit', 'Submit all captured hours')
  .action((args, cb) => {
    logger.log('This feature has not been implemented yet.');
    cb();
  });

cli
  .delimiter('hours-cli$:')
  .show()
  .log('Welcome to the Tangent Solutions CLI Hours Service.');

cli.exec('help');
