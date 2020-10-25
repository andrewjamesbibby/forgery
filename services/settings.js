const notify = require('../helpers/notifications');
const inquirer = require('inquirer');
const menu = require('../menu');
const configStore = require('configstore');
const config = new configStore('forgery');

/**
 * Set API Key
 *
 * Prompts the user for Forge API key
 * Stores the received input
 */
const setApiKey = () => {
    inquirer.prompt([
        {
            type: 'password',
            name: 'api_key',
            message: "Enter forge API key:",
            validate: (response) => {
                if(! response) {
                    return 'This cannot be empty';
                }
                return true;
            }
        },
    ])
    .then((response) => {
        config.set('forge.api_key', response.api_key);
        notify.success('Forge API key stored');
        menu.main();
    });
};

/**
 * Remove Forge Key
 *
 * Removes the Forge API Key
 */
const removeApiKey = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'confirm',
            message: "This will remove the API Key from this machine, Are you sure?",
            choices: [
                new inquirer.Separator(''),
                { name: 'No  - Do not continue', value: false },
                { name: 'Yes - Delete the API Key', value: true },
            ]
        },
    ])
    .then((response) => {

        if(! response.confirm) {
            notify.info('Aborted API Key removal');
            menu.main();
            return;
        }

        config.delete('forge.api_key');
        notify.success('Forge API key removed');
        menu.main();
    });
};

module.exports = {
    setApiKey,
    removeApiKey,
};