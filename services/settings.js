const notify = require('../helpers/notifications');
const inquirer = require('inquirer');
const menu = require('../menu');
const configStore = require('configstore');
const config = new configStore('forgery');

/**
 * Set Forge Key
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

module.exports = {
    setApiKey,
};