const { handleError } = require('../helpers/errorHandler');
const notify = require('../helpers/notifications');
const options = require('../helpers/options');
const forge = require('../forge/forge');
const inquirer = require('inquirer');
const Table = require('cli-table3');
const dedent = require('dedent');
const menu = require('../menu');
const chalk = require('chalk');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const listServers = async () => {
    try {
        const result = await forge.listServers();

        const table = new Table({
            head: [
                chalk.green('ID'),
                chalk.green('Name'),
                chalk.green('IP'),
                chalk.green('Region'),
                chalk.green('Status'),
            ]
        });

        result.data.servers.forEach((server) => {
            table.push([
                server.id,
                server.name,
                dedent`
                    Public: ${server.ip_address}
                    Private: ${server.private_ip_address}
                `,
                server.region,
                server.is_ready ? chalk.green('✓') : chalk.red('x')
            ]);
        });

        console.log(table.toString());
    } catch(error) {
        handleError(error);
    } finally {
        menu.servers();
        return;
    }
};

const getServer = async () => {

    const choices = await options.serverChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Select a server:",
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
            const result = await forge.getServer(answer.server.id);
            console.log(result.data);
        } catch(error) {
            handleError(error);
        } finally {
            menu.servers();
        }
    });

};

const createServer = async () => {

    const credentials = await forge.getCredentials();
    const regions = await forge.getRegions();

    inquirer.prompt([
        {
            type: 'list',
            name: 'provider',
            message: "Choose a service provider:",
            choices: [
                new inquirer.Separator(''),
                { name: 'Custom VPS', value: 'custom' },
                { name: 'Digital Ocean', value: 'ocean2' },
                { name: 'Linode', value: 'linode' },
                { name: 'Vultr', value: 'vultr' },
                { name: 'AWS', value: 'aws' },
                { name: 'Hetzer Cloud', value: 'hetzner' },
            ]
        },
        {
            type: 'input',
            name: 'name',
            message: 'Server name:',
        },
        {
            type: 'list',
            name: 'region',
            message: 'Region:',
            choices: (answers) => {
                let choices = [];
                regions.data.regions[answers.provider].forEach((region) => {
                    choices.push({
                        name: `${region.name} (${region.id})`,
                        value: region.id,
                    })
                });
                return choices;
            },
            when: (answers) => answers.provider !== 'custom',
        },
        {
            type: 'list',
            name: 'credential_id',
            message: 'Credentials:',
            choices: (answers) => {
                let choices = [];
                credentials.data.credentials.forEach((credential) => {
                    choices.push({
                        name: `${credential.name} (${credential.type})`,
                        value: credential.id,
                    })
                });
                return choices;
            },
            when: (answers) => answers.provider !== 'custom',
        },
        {
            type: 'input',
            name: 'ip_address',
            message: 'Public IP address:',
            when: (answers) => answers.provider == 'custom',
        },
        {
            type: 'input',
            name: 'private_ip_address',
            message: 'Private IP address:',
            when: (answers) => answers.provider == 'custom',
        },
        {
            type: 'list',
            name: 'size',
            message: "Server Size:",
            choices: (answers) => {
                let choices = [];

                regions.data.regions[answers.provider].forEach((region) => {
                    if(region.id === answers.region){
                        region.sizes.forEach((size) => {
                            choices.push({
                                name: size.name,
                                value: size.id,
                            })
                        });
                    }
                });

                return choices;
            },
            when: (answers) => answers.provider !== 'custom',
        },
        {
            type: 'input',
            name: 'size',
            message: "Server Size:",
            when: (answers) => answers.provider === 'custom',
        },
        {
            type: 'list',
            name: 'php_version',
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
        {
            type: 'list',
            name: 'database_type',
            message: "Choose database type?",
            choices: [
                new inquirer.Separator(''),
                { name: 'None', value: '' },
                { name: 'MySQL', value: 'mysql' },
                { name: 'MySQL 8', value: 'mysql8' },
                { name: 'Maria DB', value: 'mariadb' },
                { name: 'Postgress', value: 'postgress' },
            ]
        },
        {
            type: 'input',
            name: 'database',
            message: 'Database Name:',
            when: (answers) => answers.database_type !== '',
        },
        {
            type: 'list',
            name: 'node_balancer',
            message: "Provision as load balancer?",
            choices: [
                new inquirer.Separator(''),
                { name: 'No', value: false },
                { name: 'Yes', value: true },
            ]
        },
        {
            type: 'list',
            name: 'confirm',
            message: "Are you sure?",
            choices: [
                new inquirer.Separator(''),
                { name: 'No  - Do not continue', value: false },
                { name: 'Yes - Create the server', value: true },
            ]
        },
    ])
    .then(async (answers) => {

        if(! answers.confirm) {
            notify.info('Aborted server creation');
            menu.servers();
            return;
        }

        try {
            const server = await forge.createServer(answers);
            console.log(server.data);
        } catch(error) {
            handleError(error);
        } finally {
            menu.servers();
            return;
        }

    });

};

const deleteServer = async () => {

    const choices = await options.serverChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Select a server to delete:",
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

        const server_id = answer.server.id;

        inquirer.prompt([
            {
                type: 'list',
                name: 'confirmed',
                message: "Are you sure you want to delete the server?",
                choices: [
                    new inquirer.Separator(''),
                    { name: 'No  - Do not delete', value: false },
                    { name: 'Yes - Delete the server', value: true },
                ]
            },
        ]).then( async (confirm) => {

            if(! confirm.confirmed) {
                notify.info('Aborted server deletion');
                menu.servers();
                return;
            }

            try {
                const server = await forge.deleteServer(server_id);
                notify.success('Server deleted');
                console.log(server.data);
            } catch(error) {
                handleError(error);
            } finally {
                menu.servers();
                return;
            }

        });
    });

};

module.exports = {
    createServer,
    listServers,
    getServer,
    deleteServer,
};
