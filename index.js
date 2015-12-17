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
const tokenService = TokenService({
  username: config.tangentUsername,
  password: config.tangentPassword
});
const githubService = GithubService({
  username: config.githubUsername,
  password: config.githubPassword
});

githubService.getCommitsForBranch('flysaa-ios', 'swift-2')
  .then(console.log)
  .catch(console.log);

// tokenService.then((data) => {
//     const token = data.token;
//     logger.log('Logging you in...');
//     userService = UserService({ token: token });
//     projectService = ProjectService({ token: token });
//     return userService.getUser();
//   })
//   .then((user) => {
//     store.exec('setUser', user);
//     logger.log(`Logged in successfully. Welcome ${user.first_name}.`);
//     return projectService.getTasks(user.id);
//   })
//   .then((projects) => {
//     store.exec('setProjects', projects, Object.keys(config.projectToRepo));
//     logger.log(`We found and linked ${store.getState().projects.length} projects to your Github account.`);
//   })
//   .catch((err) => console.log(err));

// cli
//   .command('start', 'Start submitting your hours')
//   .action(function(args, cb) {
//     return tokenService.then((data) => {
//         userService = UserService({ token: data.token });
//         return userService.getUser();
//       }).then(console.log)
//       .catch((err) => console.log(err));
//   });
//
// cli
//   .delimiter('hours-cli$:')
//   .show()
//   .log('Welcome to the Tangent Solution CLI hours service.');
//
// cli.exec('help');
// cli.exec('start');
// cli.exec('exit');
