const { handleError } = require('../helpers/errorHandler');
const options = require('../helpers/options');
const forge = require('../forge/forge');
const inquirer = require('inquirer');
const menu = require('../menu');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const getServerLogs = async () => {

    let choices;

    try {
        choices = await options.serverChoices();
    } catch(error) {
        handleError(error);
        menu.serverLogs();
        return;
    }

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Which server to get logs from?",
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
            name: 'file',
            message: "Select log type:",
            choices: [
                new inquirer.Separator(''),
                { name: 'Nginx Access', value: 'nginx_access' },
                { name: 'Nginx Error', value: 'nginx_error' },
                { name: 'Database', value: 'database' },
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
            const logs = await forge.getServerLogs(answer.server.id, answer.file);
            console.log(logs.data.content);
        } catch(error) {
            handleError(error);
        } finally {
            menu.serverLogs();
            return;
        }
    });

};

module.exports = {
    getServerLogs,
};
