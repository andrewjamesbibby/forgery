const { handleError } = require('../helpers/errorHandler');
const notify = require('../helpers/notifications');
const options = require('../helpers/options');
const forge = require('../forge/forge');
const inquirer = require('inquirer');
const Table = require('cli-table3');
const menu = require('../menu');
const chalk = require('chalk');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const createRule = async () => {

    const choices = await options.serverChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Which server to create the rule on?",
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
            message: 'Name:',
        },
        {
            type: 'input',
            name: 'ip_address (optional)',
            message: 'IP Address:',
        },
        {
            type: 'input',
            name: 'port',
            message: 'Port:',
        },
        {
            type: 'list',
            name: 'type',
            message: "Type:",
            choices: [
                new inquirer.Separator(''),
                { name: 'Allow', value: 'allow' },
                { name: 'Deny', value: 'deny' },
            ]
        },
    ]).then(async (answers) => {
        try {
            const rule = await forge.createRule(answers.server.id, answers);
            console.log(rule.data);
        } catch(error) {
            handleError(error);
        } finally {
            menu.firewallRules();
            return;
        }
    });

};

const listRules = async () => {

    const choices = await options.serverChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Which server to list rules?",
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
            const result = await forge.listRules(answer.server.id);
            const table = new Table({
                head: [
                    chalk.green('Rule Id'),
                    chalk.green('Name'),
                    chalk.green('Port'),
                    chalk.green('Type'),
                    chalk.green('IP'),
                ]
            });

            result.data.rules.forEach((rule) => {
                table.push([
                    rule.id,
                    rule.name,
                    rule.port,
                    rule.type,
                    rule.ip_address,
                ]);
            });

            console.log(table.toString());
        } catch(error) {
            handleError(error);
        } finally {
            menu.firewallRules();
            return;
        }
    });

};

const deleteRule = async () => {

    const choices = await options.serverChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Which server to delete rule from?",
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
            name: 'rule',
            message: "Which rule to delete?",
            choices: async (answer) => {

                let choices = [];
                const rules = await forge.listRules(answer.server.id);
                rules.data.rules.forEach((rule) => {
                    choices.push({
                        name: `${rule.name} | ${rule.port}`,
                        value: rule.id,
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
            await forge.deleteRule(answer.server.id, answer.rule);
            notify.success('Rule deleted');
        } catch(error) {
            handleError(error);
        } finally {
            menu.firewallRules();
            return;
        }
    });

};

module.exports = {
    createRule,
    listRules,
    deleteRule,
};
