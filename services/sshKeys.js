const { handleError } = require('../helpers/errorHandler');
const notify = require('../helpers/notifications');
const options = require('../helpers/options');
const forge = require('../forge/forge');
const inquirer = require('inquirer');
const Table = require('cli-table3');
const menu = require('../menu');
const chalk = require('chalk');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const createKey = async () => {

    const choices = await options.serverChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Which server to create the key on?",
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
            name: 'name',
            message: 'Key name:',
        },
        {
            type: 'input',
            name: 'username',
            message: 'Username (e.g forge):',
        },
        {
            type: 'editor',
            name: 'key',
            default: 'Paste your public key here....',
            message: "Add public key content:",
        },
    ]).then(async (answers) => {
        try {
            const key = await forge.createKey(answers.server.id, answers);
            console.log(key.data);
        } catch(error) {
            handleError(error);
        } finally {
            menu.sshKeys();
            return;
        }
    });

};

const listKeys = async () => {

    const choices = await options.serverChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Which server to list the keys on?",
            choices: choices,
            source: (answered, input) => {
                input = input || '';
                return choices.filter(choice => {
                    return choice.name.includes(input);
                });
            },
        },
    ]).then(async (answers) => {
        try {
            const result = await forge.listKeys(answers.server.id);

            const table = new Table({
                head: [
                    chalk.green('Key Id'),
                    chalk.green('Name'),
                    chalk.green('Username'),
                    chalk.green('Status'),
                ]
            });

            result.data.keys.forEach((key) => {
                table.push([
                    key.id,
                    key.name,
                    key.username,
                    key.status === 'installed' ? chalk.green('✓') : chalk.red('x')
                ]);
            });

            console.log(table.toString());
        } catch(error) {
            handleError(error);
        } finally {
            menu.sshKeys();
            return;
        }
    });

};

const deleteKey = async () => {

    const choices = await options.serverChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Which server to delete the key on?",
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
            name: 'key_id',
            message: "Which key to delete?",
            choices: async (answer) => {
                let choices = [];
                const keys = await forge.listKeys(answer.server.id);

                keys.data.keys.forEach((key) => {
                    choices.push({
                        name: `${key.id} | ${key.name}`,
                        value: key.id,
                    })
                });
                return choices;
            },
        },
    ]).then(async (answers) => {
        try {
            await forge.deleteKey(answers.server.id, answers.key_id);
            notify.success('Key Deleted');
        } catch(error) {
            handleError(error);
        } finally {
            menu.sshKeys();
            return;
        }
    });

};

module.exports = {
    createKey,
    listKeys,
    deleteKey,
};
