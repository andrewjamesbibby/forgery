const { handleError } = require('../helpers/errorHandler');
const notify = require('../helpers/notifications');
const options = require('../helpers/options');
const forge = require('../forge/forge');
const inquirer = require('inquirer');
const Table = require('cli-table3');
const menu = require('../menu');
const chalk = require('chalk');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const createDaemon = async () => {

    const choices = await options.serverChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Which server to create the daemon on?",
            choices: choices,
            source: (answered, input) => {
                input = input || '';
                return choices.filter(choice => {
                    return choice.name.includes(input);
                });
            },
        },
        {
            type: 'input',
            name: 'command',
            message: 'Command:',
        },
        {
            type: 'input',
            name: 'user',
            message: 'User (e.g root):',
        },
        {
            type: 'input',
            name: 'directory',
            message: 'Directory:',
        },
    ]).then(async (answers) => {
        try {
            const daemon = await forge.createDaemon(answers.server.id, answers);
            console.log(daemon.data);
        } catch(error) {
            handleError(error);
        } finally {
            menu.daemons();
            return;
        }
    });

};

const listDaemons = async () => {

    const choices = await options.serverChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Which server to list daemons?",
            choices: choices,
            source: (answered, input) => {
                input = input || '';
                return choices.filter(choice => {
                    return choice.name.includes(input);
                });
            },
        }
    ]).then(async (answer) => {
        try {
            const result = await forge.listDaemons(answer.server.id);

            const table = new Table({
                head: [
                    chalk.green('Daemon Id'),
                    chalk.green('Command'),
                    chalk.green('User'),
                    chalk.green('Directory'),
                    chalk.green('Status'),
                ]
            });

            result.data.daemons.forEach((daemon) => {
                table.push([
                    daemon.id,
                    daemon.command,
                    daemon.user,
                    daemon.directory,
                    daemon.status,
                ]);
            });

            console.log(table.toString());
        } catch(error) {
            handleError(error);
        } finally {
            menu.daemons();
            return;
        }
    });

};

const deleteDaemon = async () => {

    const choices = await options.serverChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Which server to delete daemon from?",
            choices: choices,
            source: (answered, input) => {
                input = input || '';
                return choices.filter(choice => {
                    return choice.name.includes(input);
                });
            },
        },
        {
            type: 'list',
            name: 'daemon_id',
            message: "Which daemon to delete?",
            choices: async (answer) => {

                let choices = [];
                const daemons = await forge.listDaemons(answer.server.id);

                daemons.data.daemons.forEach((daemon) => {
                    choices.push({
                        name: `${daemon.id} | ${daemon.command}`,
                        value: daemon.id,
                    })
                });
                return choices;
            },
            source: (answered, input) => {
                input = input || '';
                return choices.filter(choice => {
                    return choice.name.includes(input);
                });
            },
        },
    ])
    .then(async (answer) => {
        try {
            await forge.deleteDaemon(answer.server.id, answer.daemon_id);
            notify.success('Daemon deleted');
        } catch(error) {
            handleError(error);
        } finally {
            menu.daemons();
            return;
        }
    });

};

const restartDaemon = async () => {

    const choices = await options.serverChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Which server to restart daemon on?",
            choices: choices,
            source: (answered, input) => {
                input = input || '';
                return choices.filter(choice => {
                    return choice.name.includes(input);
                });
            },
        },
        {
            type: 'list',
            name: 'daemon_id',
            message: "Which daemon to restart?",
            choices: async (answer) => {

                let choices = [];
                const daemons = await forge.listDaemons(answer.server.id);

                daemons.data.daemons.forEach((daemon) => {
                    choices.push({
                        name: `${daemon.id} | ${daemon.command}`,
                        value: daemon.id,
                    })
                });
                return choices;
            },
            source: (answered, input) => {
                input = input || '';
                return choices.filter(choice => {
                    return choice.name.includes(input);
                });
            },
        },
    ])
    .then(async (answer) => {
        try {
            await forge.restartDaemon(answer.server.id, answer.daemon_id);
            notify.success('Daemon restarted');
        } catch(error) {
            handleError(error);
        } finally {
            menu.daemons();
            return;
        }
    });

};

module.exports = {
    createDaemon,
    listDaemons,
    deleteDaemon,
    restartDaemon,
};
