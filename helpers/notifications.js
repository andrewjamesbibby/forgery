const chalk = require('chalk');

const success = (message) => {
    console.log(chalk.green(`✓ ${message}`));
};

const info = (message) => {
    console.log(chalk.yellow(`𝔧 ${message}`));
};

const error = (message) => {
    console.log(chalk.red(`! ${message}`));
};

module.exports = {
    success,
    info,
    error,
};