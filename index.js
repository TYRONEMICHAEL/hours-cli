import Vorpal from 'vorpal';
import moment from 'moment';
import hours from './hours';

const fromDate = moment(hours.from);
const toDate = moment(hours.to);



const banner = 'Welcome to the standalone Vorpal server.';
const delimiter = 'hours-cli$';
const cli = new Vorpal();



const start = (context) => {
  return new Promise((resolve, reject) => {
    context.prompt({
      type: 'input',
      name: 'start',
      default: Number,
      message: `Please enter the date (YYYY-MM-DD) of when you would like to START submitting your hours: `,
    }, (result) => {
      resolve();
    });
  });
};

cli
  .command('start', 'Start submitting your hours')
  .action(function(args, cb) {
    return start(this).then(() => start(this)).then(cb);
  });

cli
  .delimiter('hours-cli$:')
  .show()
  .log('Welcome to the Tangent Solution CLI hours service.')
  .exec('help');
