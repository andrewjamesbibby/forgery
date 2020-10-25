const { handleError } = require('../helpers/errorHandler');
const notify = require('../helpers/notifications');
const options = require('../helpers/options');
const forge = require('../forge/forge');
const inquirer = require('inquirer');
const Table = require('cli-table3');
const menu = require('../menu');
const chalk = require('chalk');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const createWorker = async () => {

    const choices = await options.siteChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'site',
            message: "Which site to create the worker on?",
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
            name: 'queue',
            message: 'Queue name:',
        },
        {
            type: 'input',
            name: 'connection',
            message: 'Connection (e.g redis):',
        },
        {
            type: 'input',
            name: 'timeout',
            message: 'Timeout (e.g 60):',
        },
        {
            type: 'input',
            name: 'sleep',
            message: 'Sleep (e.g 60):',
        },
        {
            type: 'input',
            name: 'tries',
            message: 'Maximum Tries (e.g 3):',
        },
        {
            type: 'input',
            name: 'processes',
            message: 'Processes (e.g 1):',
        },
        {
            type: 'list',
            name: 'php_version',
            message: "PHP Version:",
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
            name: 'daemon',
            message: "Run worker as daemon:",
            choices: [
                new inquirer.Separator(''),
                { name: 'No', value: false },
                { name: 'Yes', value: true },
            ]
        },
        {
            type: 'list',
            name: 'force',
            message: "Always run, even in maintainance mode:",
            choices: [
                new inquirer.Separator(''),
                { name: 'No', value: false },
                { name: 'Yes', value: true },
            ]
        },
    ]).then(async (answers) => {
        try {
            const worker = await forge.createWorker(answers.site.server_id, answers.site.id, answers);
            console.log(worker.data);
        } catch(error) {
            handleError(error);
        } finally {
            menu.workers();
            return;
        }
    });

};

const listWorkers = async () => {

    const choices = await options.siteChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Which site to list jobs?",
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
            const workers = await forge.listWorkers(answer.server.server_id, answer.server.id);

            const table = new Table({
                head: [
                    chalk.green('Worker ID'),
                    chalk.green('Queue'),
                    chalk.green('Connection'),
                    chalk.green('Daemon'),
                    chalk.green('Processes'),
                    chalk.green('Tries'),
                ]
            });

            workers.data.workers.forEach((worker) => {
                table.push([
                    worker.id,
                    worker.queue,
                    worker.connection,
                    worker.daemon ? chalk.green('✓') : chalk.red('x'),
                    worker.processes,
                    worker.tries,
                ]);
            });

            console.log(table.toString());
        } catch(error) {
            handleError(error);
        } finally {
            menu.workers();
            return;
        }
    });

};

const getWorker = async () => {

    const choices = await options.siteChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'site',
            message: "Which site to get worker from?",
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
            name: 'worker_id',
            message: "Which worker to get?",
            choices: async (answer) => {

                let choices = [];
                const workers = await forge.listWorkers(answer.site.server_id, answer.site.id);

                workers.data.workers.forEach((worker) => {
                    choices.push({
                        name: `${worker.id} | ${worker.queue} | ${worker.connection}`,
                        value: worker.id,
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
            const worker = await forge.getWorker(answer.site.server_id, answer.site.id, answer.worker_id);
            console.log(worker.data);
        } catch(error) {
            handleError(error);
        } finally {
            menu.workers();
            return;
        }
    });

};

const deleteWorker = async () => {

    const choices = await options.siteChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'site',
            message: "Which site to delete worker from?",
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
            name: 'worker_id',
            message: "Which worker to delete?",
            choices: async (answer) => {

                let choices = [];
                const workers = await forge.listWorkers(answer.site.server_id, answer.site.id);

                workers.data.workers.forEach((worker) => {
                    choices.push({
                        name: `${worker.id} | ${worker.queue} | ${worker.connection}`,
                        value: worker.id,
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
            await forge.deleteWorker(answer.site.server_id, answer.site.id, answer.worker_id);
            notify.success('Worker deleted');
        } catch(error) {
            handleError(error);
        } finally {
            menu.workers();
            return;
        }
    });

};

const restartWorker = async () => {

    const choices = await options.siteChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'site',
            message: "Which site to restart worker on?",
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
            name: 'worker_id',
            message: "Which worker to restart?",
            choices: async (answer) => {

                let choices = [];
                const workers = await forge.listWorkers(answer.site.server_id, answer.site.id);

                workers.data.workers.forEach((worker) => {
                    choices.push({
                        name: `${worker.id} | ${worker.queue} | ${worker.connection}`,
                        value: worker.id,
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
            const worker = await forge.restartWorker(answer.site.server_id, answer.site.id, answer.worker_id);
            notify.success('Worker restarted');
        } catch(error) {
            handleError(error);
        } finally {
            menu.workers();
            return;
        }
    });

};

module.exports = {
    createWorker,
    listWorkers,
    getWorker,
    deleteWorker,
    restartWorker,
};
