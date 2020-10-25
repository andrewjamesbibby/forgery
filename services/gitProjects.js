const { handleError } = require('../helpers/errorHandler');
const notify = require('../helpers/notifications');
const options = require('../helpers/options');
const forge = require('../forge/forge');
const inquirer = require('inquirer');
const menu = require('../menu');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const installNewRepository = async () => {

    const choices = await options.siteChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'site',
            message: "Install new repository on which site?",
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
            name: 'provider',
            message: "Provider:",
            choices: [
                new inquirer.Separator(''),
                { name: 'GitHub', value: 'github' },
                { name: 'GitLab', value: 'gitlab' },
                { name: 'GitLab Custom', value: 'gitlab-custom' },
                { name: 'Bitbucket', value: 'bitbucket' },
                { name: 'Custom', value: 'custom' },
            ]
        },
        {
            type: 'input',
            name: 'branch',
            message: "Branch (e.g master):",
        },
        {
            type: 'input',
            name: 'repository',
            message: "Repository (e.g username/respository):",
        },
        {
            type: 'list',
            name: 'composer',
            message: "Install composer dependencies?",
            choices: [
                new inquirer.Separator(''),
                { name: 'No', value: false },
                { name: 'Yes', value: true },
            ]
        },
    ])
    .then(async (answers) => {
        try {
            await forge.installNewRepository(answers.site.server_id, answers.site.id, answers);
            notify.success('Repository Installing');
        } catch(error) {
            handleError(error);
        } finally {
            menu.gitProjects();
            return;
        }
    });

};

const removeRepository = async () => {

    const choices = await options.siteChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'site',
            message: "Remove repository on which site?",
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
            name: 'confirm',
            message: "Are you sure?",
            choices: [
                new inquirer.Separator(''),
                { name: 'No  - Do not continue', value: false },
                { name: 'Yes - Remove repository', value: true },
            ]
        },
    ])
    .then(async (answers) => {

        if(! answers.confirm) {
            notify.info('Aborted repository deletion');
            menu.gitProjects();
            return;
        }

        try {
            await forge.removeRepository(answers.site.server_id, answers.site.id);
            notify.success('Repository Removed');
        } catch(error) {
            handleError(error);
        } finally {
            menu.gitProjects();
            return;
        }
    });

};

module.exports = {
    installNewRepository,
    removeRepository,
};
