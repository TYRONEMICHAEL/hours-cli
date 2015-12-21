import stampit from 'stampit';
import logUpdate from 'log-update';
import chalk from 'chalk';
import elegantSpinner from 'elegant-spinner';
import logSymbols from 'log-symbols';

const frame = elegantSpinner();
let interval;

const Logger = stampit.methods({
  success(obj) {
    console.log(this.prefixSuccess, chalk.bgWhite.gray(obj));
  },

  log(obj) {
    console.log(this.prefixInfo, chalk.bgWhite.gray(obj));
  },

  error(err) {
    console.log(this.prefixError, err);
  },

  showLoader(message) {
    interval = setInterval(function () {
      logUpdate(`${message}: ${frame()}`);
    }, 50);
  },

  highlight(message) {
    console.log('');
    console.log('-----------------------------');
    console.log(chalk.bgMagenta.gray(message));
    console.log('-----------------------------');
    console.log('');
  },

  stopLoader() {
    clearInterval(interval);
    logUpdate.clear();
    logUpdate.done();
  }
}).refs({
  prefixSuccess: logSymbols.success + ' Success: ',
  prefixInfo: logSymbols.info + ' Info: ',
  prefixError: logSymbols.error + ' Error: ',
  prefixWarning: logSymbols.warning + ' Warning: '
});

export default Logger;
