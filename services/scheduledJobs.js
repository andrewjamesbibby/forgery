const { handleError } = require('../helpers/errorHandler');
const notify = require('../helpers/notifications');
const options = require('../helpers/options');
const forge = require('../forge/forge');
const inquirer = require('inquirer');
const Table = require('cli-table3');
const menu = require('../menu');
const chalk = require('chalk');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const createJob = async () => {

    let choices;

    try {
        choices = await options.serverChoices();
    } catch(error) {
        handleError(error);
        menu.scheduledJobs();
        return;
    }

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Which server to create the job on?",
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
            name: 'command',
            message: 'Command:',
        },
        {
            type: 'input',
            name: 'user',
            message: 'User (e.g root):',
        },
        {
            type: 'list',
            name: 'frequency',
            message: "Frequency:",
            choices: [
                new inquirer.Separator(''),
                { name: 'Minutely', value: 'minutely' },
                { name: 'Hourly', value: 'hourly' },
                { name: 'Nightly', value: 'nightly' },
                { name: 'Weekly', value: 'weekly' },
                { name: 'Monthly', value: 'monthly' },
                { name: 'Reboot', value: 'reboot' },
            ]
        },
    ]).then(async (answers) => {
        try {
            const job = await forge.createJob(answers.server.id, answers);
            console.log(job.data);
        } catch(error) {
            handleError(error);
        } finally {
            menu.scheduledJobs();
            return;
        }
    });

};

const listJobs = async () => {

    let choices;

    try {
        choices = await options.serverChoices();
    } catch(error) {
        handleError(error);
        menu.scheduledJobs();
        return;
    }

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Which server to list jobs?",
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
            const jobs = await forge.listJobs(answer.server.id);

            const table = new Table({
                head: [
                    chalk.green('Job Id'),
                    chalk.green('Command'),
                    chalk.green('User'),
                    chalk.green('Frequency'),
                ]
            });

            jobs.data.jobs.forEach((job) => {
                table.push([
                    job.id,
                    job.command,
                    job.user,
                    job.frequency,
                ]);
            });

            console.log(table.toString());
        } catch(error) {
            handleError(error);
        } finally {
            menu.scheduledJobs();
            return;
        }
    });

};

const deleteJob = async () => {

    let choices;

    try {
        choices = await options.serverChoices();
    } catch(error) {
        handleError(error);
        menu.scheduledJobs();
        return;
    }

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'server',
            message: "Which server to delete job from?",
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
            name: 'job_id',
            message: "Which daemon to delete?",
            choices: async (answer) => {

                let choices = [];
                const jobs = await forge.listJobs(answer.server.id);

                jobs.data.jobs.forEach((job) => {
                    choices.push({
                        name: `${job.id} | ${job.command}`,
                        value: job.id,
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
            await forge.deleteJob(answer.server.id, answer.job_id);
            notify.success('Job deleted');
        } catch(error) {
            handleError(error);
        } finally {
            menu.scheduledJobs();
            return;
        }
    });

};

module.exports = {
    createJob,
    listJobs,
    deleteJob,
};
