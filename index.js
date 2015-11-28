import Vorpal from 'vorpal';

const banner = 'Welcome to the standalone Vorpal server.';
const delimiter = 'hours-cli$';
const cli = new Vorpal();

cli
  .delimiter('hours-cli$:')
  .show()
  .log('Welcome to the Tangent Solution CLI hours service.')
  .exec('help');
