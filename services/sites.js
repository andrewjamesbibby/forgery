const { handleError } = require('../helpers/errorHandler');
const notify = require('../helpers/notifications');
const options = require('../helpers/options');
const forge = require('../forge/forge');
const inquirer = require('inquirer');
const Table = require('cli-table3');
const menu = require('../menu');
const chalk = require('chalk');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const createSite = async () => {

    let choices;

    try {
        choices = await options.serverChoices();
    } catch(error) {
        handleError(error);
        menu.sites();
        return;
    }

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Which server to create the site on?",
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
            name: 'domain',
            message: 'Domain (e.g site.com):',
        },
        {
            type: 'list',
            name: 'project_type',
            message: "project_type:",
            choices: [
                new inquirer.Separator(''),
                { name: 'General PHP/Laravel Application', value: 'php' },
                { name: 'Static HTML site', value: 'html' },
                { name: 'Symfony Application', value: 'symfony' },
                { name: 'Symfony (Dev) Application', value: 'symfony_dev' },
                { name: 'Symfony >4.0 Application', value: 'symfony_four' },
            ]
        },
        {
            type: 'input',
            name: 'directory',
            message: 'Directory (e.g /public):',
        },
        {
            type: 'list',
            name: 'isolation',
            message: "Use website isolation?",
            choices: [
                new inquirer.Separator(''),
                { name: 'No', value: false },
                { name: 'Yes', value: true },
            ]
        },
        {
            type: 'input',
            name: 'username',
            message: 'Web isolation username:',
            when: (answers) => answers.isolation
        },
        {
            type: 'list',
            name: 'create_database',
            message: "Create database?",
            choices: [
                new inquirer.Separator(''),
                { name: 'No', value: false },
                { name: 'Yes', value: true },
            ]
        },
        {
            type: 'input',
            name: 'database',
            message: 'Database name:',
            when: (answers) => answers.create_database
        },
    ]).then(async (answers) => {
        try {
            const site = await forge.createSite(answers.server.id, answers);
            console.log(site.data);
        } catch(error) {
            handleError(error);
        } finally {
            menu.sites();
            return;
        }
    });

};

const listSites = async () => {
    try {
        const result = await forge.listSites();

        const table = new Table({
            head: [
                chalk.green('Site Id'),
                chalk.green('Server Id'),
                chalk.green('Name'),
                chalk.green('Installed'),
            ]
        });

        result.data.sites.forEach((site) => {
            table.push([
                site.id,
                site.server_id,
                site.name,
                site.status === 'installed' ? chalk.green('✓') : chalk.red('x')
            ]);
        });

        console.log(table.toString());
    } catch(error) {
        handleError(error);
    } finally {
        menu.sites();
        return;
    }
};

const getSite = async () => {

    let choices;

    try {
        choices = await forge.listSites();
    } catch(error) {
        handleError(error);
        menu.sites();
        return;
    }

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'site',
            message: "Select a site:",
            choices: choices,
            source: (answered, input) => {
                input = input || '';
                return choices.filter(choice => {
                    return choice.name.includes(input);
                });
            },
        },
    ]).then(async (answer) => {
        console.log(answer);
        menu.sites();
    });

};

const deleteSite = async () => {

    let choices;

    try {
        choices = await forge.listSites();
    } catch(error) {
        handleError(error);
        menu.sites();
        return;
    }

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'site',
            message: "Select a site to delete:",
            choices: choices,
            source: (answered, input) => {
                input = input || '';
                return choices.filter(choice => {
                    return choice.name.includes(input);
                });
            },
        },
    ])
    .then((answer) => {

        const server_id = answer.site.server_id;
        const site_id = answer.site.id;

        inquirer.prompt([
            {
                type: 'list',
                name: 'confirmed',
                message: "Are you sure you want to delete the site?",
                choices: [
                    new inquirer.Separator(''),
                    { name: 'No  - Do not delete', value: false },
                    { name: 'Yes - Delete the site', value: true },
                ]
            },
        ]).then( async (confirm) => {

            if(! confirm.confirmed) {
                notify.info('Aborted site deletion');
                menu.sites();
                return;
            }

            try {
                const server = await forge.deleteSite(server_id, site_id);
                notify.success('Site deleted');
            } catch(error) {
                handleError(error);
            } finally {
                menu.sites();
                return;
            }

        });
    });

};

module.exports = {
    createSite,
    listSites,
    getSite,
    deleteSite,
};
