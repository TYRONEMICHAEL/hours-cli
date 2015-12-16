import Vorpal from 'vorpal';
import credentials from './credentials';
import hours from './hours';
import getDates from './utils/getDates';
import TokenService from './lib/TokenService';
import UserService from './lib/UserService';
import ProjectService from './lib/ProjectService';
import Store from './lib/Store';

const store = Store();
store.exec('setUser', { 'name': 'Tyrone' });
console.log(store.reducers);

// const cli = new Vorpal();
// const delimiter = 'hours-cli$';
// const tokenService = TokenService({
//   username: credentials.tangentUsername,
//   password: credentials.tangentPassword
// });
//
// let userService;
// let projectService;
//
// tokenService.then((data) => {
//     const token = data.token;
//     userService = UserService({ token: token });
//     projectService = ProjectService({ token: token });
//     return userService.getUser();
//   })
//   .then((user) => projectService.getTasks(user.id))
//   .then(console.log)
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
