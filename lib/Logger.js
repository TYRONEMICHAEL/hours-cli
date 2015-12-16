import stampit from 'stampit';

const Logger = stampit.methods({
  log(obj) {
    console.log(this.prefix, obj);
  }
}).refs({
  prefix: 'STDOUT: '
});

export default Logger;
