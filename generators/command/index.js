const Generator = require('yeoman-generator');
const yosay = require('yosay');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'bundle',
      message: 'Bundle',
      validate: function (input) {
        if (input.length && input.match(/^[a-z\-_]+$/)) {
          return true;
        }

        return 'Invalid bundle name';
      }
    }, {
      type: 'input',
      name: 'name',
      message: 'Command name (a-z, no spaces or special characters)',
      validate: function (input) {
        if (input.length && input.match(/^[a-z\-_]+$/)) {
          return true;
        }

        return 'Invalid command name';
      }
    }]).then(answers => {
      this.options.bundle = answers.bundle;
      this.options.name = answers.name;
    });
  }

  writing() {
    const commandDir = `bundles/${this.options.bundle}/commands/`;
    const targetFile = this.destinationPath(commandDir + this.options.name + '.js');

    if (this.fs.exists(targetFile)) {
      return this.log('Command already exists');
    }

    this.log(`Creating bundles/${this.options.bundle}/commands/${this.options.name}.js`);

    mkdirp.sync(commandDir);
    this.fs.copyTpl(
      this.templatePath('command.js'),
      targetFile,
      { command: this.options.name }
    );
  }
};

