const { handleError } = require('../helpers/errorHandler');
const notify = require('../helpers/notifications');
const options = require('../helpers/options');
const forge = require('../forge/forge');
const inquirer = require('inquirer');
const menu = require('../menu');
const chalk = require('chalk');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const enableQuickDeployment = async () => {

    let choices;

    try {
        choices = await options.siteChoices();
    } catch(error) {
        handleError(error);
        menu.deployment();
        return;
    }

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'site',
            message: "Enable quick deployment on which site?",
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
            await forge.enableQuickDeployment(answer.site.server_id, answer.site.id);
            notify.success('Quick Deployment Enabled');
        } catch(error) {
            handleError(error);
        } finally {
            menu.deployment();
            return;
        }
    });

};

const disableQuickDeployment = async () => {

    let choices;

    try {
        choices = await options.siteChoices();
    } catch(error) {
        handleError(error);
        menu.deployment();
        return;
    }

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'site',
            message: "Disable quick deployment on which site?",
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
            await forge.disableQuickDeployment(answer.site.server_id, answer.site.id);
            notify.success('Quick Deployment Disabled');
        } catch(error) {
            handleError(error);
        } finally {
            menu.deployment();
            return;
        }
    });

};

const getDeploymentScript = async () => {

    let choices;

    try {
        choices = await options.siteChoices();
    } catch(error) {
        handleError(error);
        menu.deployment();
        return;
    }

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'site',
            message: "Which site to get the deployment script from?",
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
            const script = await forge.getDeploymentScript(answer.site.server_id, answer.site.id);
            console.log(chalk.green(script.data));
        } catch(error) {
            handleError(error);
        } finally {
            menu.deployment();
            return;
        }
    });

};

const updateDeploymentScript = async () => {

    let choices;

    try {
        choices = await options.siteChoices();
    } catch(error) {
        handleError(error);
        menu.deployment();
        return;
    }

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'site',
            message: "Which site to update the deployment script?",
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
                const config = await forge.getDeploymentScript(answer.site.server_id, answer.site.id);
                return config.data;
            },
            message: "Update Deployment Script:",
        },
    ])
    .then(async (answer) => {

        try {
            await forge.updateDeploymentScript(answer.site.server_id, answer.site.id, {
                content: answer.content
            });
            notify.success('Deployment script updated');
        } catch(error) {
            handleError(error);
        } finally {
            menu.deployment();
            return;
        }
    });

};

const deployNow = async () => {

    let choices;

    try {
        choices = await options.siteChoices();
    } catch(error) {
        handleError(error);
        menu.deployment();
        return;
    }

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'site',
            message: "Deploy which site?",
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
            await forge.deployNow(answer.site.server_id, answer.site.id);
            notify.success('Deployment Triggered');
        } catch(error) {
            handleError(error);
        } finally {
            menu.deployment();
            return;
        }
    });

};

const resetDeploymentStatus = async () => {

    let choices;

    try {
        choices = await options.siteChoices();
    } catch(error) {
        handleError(error);
        menu.deployment();
        return;
    }

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'site',
            message: "Reset deployment status on which site?",
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
            await forge.resetDeploymentStatus(answer.site.server_id, answer.site.id);
            notify.success('Deployment Status Reset');
        } catch(error) {
            handleError(error);
        } finally {
            menu.deployment();
            return;
        }
    });

};

const getDeploymentLog = async () => {

    let choices;

    try {
        choices = await options.siteChoices();
    } catch(error) {
        handleError(error);
        menu.deployment();
        return;
    }

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'site',
            message: "Get deployment log for which site?",
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
            const log = await forge.getDeploymentLog(answer.site.server_id, answer.site.id);
            console.log(log.data);
        } catch(error) {
            handleError(error);
        } finally {
            menu.deployment();
            return;
        }
    });

};

module.exports = {
    enableQuickDeployment,
    disableQuickDeployment,
    getDeploymentScript,
    updateDeploymentScript,
    deployNow,
    resetDeploymentStatus,
    getDeploymentLog,
};
