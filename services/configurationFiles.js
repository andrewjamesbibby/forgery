const { handleError } = require('../helpers/errorHandler');
const notify = require('../helpers/notifications');
const options = require('../helpers/options');
const forge = require('../forge/forge');
const inquirer = require('inquirer');
const menu = require('../menu');
const chalk = require('chalk');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const getNginxConfiguration = async () => {

    const choices = await options.siteChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'site',
            message: "Which site to get Nginx configuration from?",
            choices: choices,
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
            const config = await forge.getNginxConfiguration(answer.site.server_id, answer.site.id);
            console.log(chalk.green(config.data));
        } catch(error) {
            handleError(error);
        } finally {
            menu.configurationFiles();
            return;
        }
    });

};

const updateNginxConfiguration = async () => {

    const choices = await options.siteChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'site',
            message: "Which site to update Nginx configuration?",
            choices: choices,
            source: (answered, input) => {
                input = input || '';
                return choices.filter(choice => {
                    return choice.name.includes(input);
                });
            },
        },
        {
            type: 'editor',
            name: 'content',
            default: async (answer) => {
                const config = await forge.getNginxConfiguration(answer.site.server_id, answer.site.id);
                return config.data;
            },
            message: "Update Nginx file:",
        },
    ])
    .then(async (answer) => {
        try {
            const config = await forge.updateNginxConfiguration(answer.site.server_id, answer.site.id, {
                content: answer.content
            });
            notify.success('Nginx configuration updated');
        } catch(error) {
            handleError(error);
        } finally {
            menu.configurationFiles();
            return;
        }
    });

};

const getEnvironmentFile = async () => {

    const choices = await options.siteChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'site',
            message: "Which site to get Environment file from?",
            choices: choices,
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
            const environment = await forge.getEnvironmentFile(answer.site.server_id, answer.site.id);
            console.log(chalk.green(environment.data));
        } catch(error) {
            handleError(error);
        } finally {
            menu.configurationFiles();
            return;
        }
    });

};

const updateEnvironmentFile = async () => {

    const choices = await options.siteChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'site',
            message: "Which site to update environment file?",
            choices: choices,
            source: (answered, input) => {
                input = input || '';
                return choices.filter(choice => {
                    return choice.name.includes(input);
                });
            },
        },
        {
            type: 'editor',
            name: 'content',
            default: async (answer) => {
                const environment = await forge.getEnvironmentFile(answer.site.server_id, answer.site.id);
                return environment.data;
            },
            message: "Update Environment file:",
        },
    ])
    .then(async (answer) => {
        try {
            const config = await forge.updateEnvironmentFile(answer.site.server_id, answer.site.id, {
                content: answer.content
            });
            notify.success('Environment file updated');
        } catch(error) {
            handleError(error);
        } finally {
            menu.configurationFiles();
            return;
        }
    });

};

module.exports = {
    getNginxConfiguration,
    updateNginxConfiguration,
    getEnvironmentFile,
    updateEnvironmentFile,
};
