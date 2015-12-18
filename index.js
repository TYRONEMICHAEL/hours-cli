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

cli
  .command('start', 'Start submitting your hours')
  .action(function(args, cb) {
    return tokenService.then((data) => {
        const token = data.token;
        logger.log('Logging you in...');
        userService = UserService({ token: token });
        projectService = ProjectService({ token: token });
        return userService.getUser();
      })
      .then((user) => {
        store.exec('setUser', user);
        logger.log(`Logged in successfully. Welcome ${user.first_name}.`);
        return projectService.getTasks(user.id);
      })
      .then((projects) => {
        let promiseArr = [];
        let state;

        store.exec('setProjects', projects, projectToRepo);
        state = store.getState();
        logger.log(`We found and linked ${Object.keys(store.getState().projects).length} projects to your Github account.`);
        repoNames.forEach((repo) => promiseArr.push(githubService.getBranchesForRepo(repo)));
        return Promise.all(promiseArr);
      })
      .then((repos) => {
        repos.forEach((branches, index) => {
          logger.log(`Found ${branches.length} branches for ${repoNames[index]}.`);
        });
      })
      .catch((err) => console.log(err));
  });

cli
  .delimiter('hours-cli$:')
  .show()
  .log('Welcome to the Tangent Solution CLI hours service.');

cli.exec('help');
