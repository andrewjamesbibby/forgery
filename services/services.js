const { handleError } = require('../helpers/errorHandler');
const notify = require('../helpers/notifications');
const options = require('../helpers/options');
const forge = require('../forge/forge');
const inquirer = require('inquirer');
const menu = require('../menu');

const rebootNginx = async () => {

    let choices;

    try {
        choices = await options.serverChoices();
    } catch(error) {
        handleError(error);
        menu.services();
        return;
    }

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Reboot Nginx on which server?",
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
            const server = await forge.rebootNginx(answer.server.id);
            notify.success('Nginx rebooted');
            console.log(server.data);
        } catch(error) {
            handleError(error);
        } finally {
            menu.services();
            return;
        }
    });

};

const rebootPhp = async () => {

    let choices;

    try {
        choices = await options.serverChoices();
    } catch(error) {
        handleError(error);
        menu.services();
        return;
    }

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Reboot PHP on which server?",
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
            name: 'version',
            message: "PHP Version?",
            choices: [
                new inquirer.Separator(''),
                { name: '7.4', value: 'php74' },
                { name: '7.3', value: 'php73' },
                { name: '7.2', value: 'php72' },
                { name: '7.1', value: 'php71' },
                { name: '7.0', value: 'php70' },
                { name: '5.6', value: 'php56' },
            ]
        },
    ])
    .then(async (answer) => {
        try {
            const server = await forge.rebootPhp(answer.server.id, { version: answer.version });
            notify.success('PHP rebooted');
            console.log(server.data);
        } catch(error) {
            handleError(error);
        } finally {
            menu.services();
            return;
        }
    });

};

const rebootMysql = async () => {

    let choices;

    try {
        choices = await options.serverChoices();
    } catch(error) {
        handleError(error);
        menu.services();
        return;
    }

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Reboot MySql on which server?",
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
            const server = await forge.rebootMysql(answer.server.id);
            notify.success('PHP rebooted');
            console.log(server.data);
        } catch(error) {
            handleError(error);
        } finally {
            menu.services();
            return;
        }
    });

};

module.exports = {
    rebootNginx,
    rebootPhp,
    rebootMysql,
};
