const configurationFiles = require('./services/configurationFiles');
const firewallRules = require('./services/firewallRules');
const scheduledJobs = require('./services/scheduledJobs');
const gitProjects = require('./services/gitProjects');
const deployment = require('./services/deployment');
const serverLogs = require('./services/serverLogs');
const settings = require('./services/settings');
const services = require('./services/services');
const daemons = require('./services/daemons');
const servers = require('./services/servers');
const sshKeys = require('./services/sshKeys');
const workers = require('./services/workers');
const recipes = require('./services/recipes');
const sites = require('./services/sites');
const inquirer = require('inquirer');

exports.main = () => {
    inquirer.prompt([
        {
            type: 'list',
            loop: false,
            name: 'action',
            pageSize: 20,
            message: "Select an option below...",
            choices: [
                new inquirer.Separator(''),
                { name: 'Servers', value: this.servers },
                { name: 'Sites', value: this.sites },
                { name: 'Services', value: this.services },
                { name: 'Firewall Rules', value: this.firewallRules },
                { name: 'Daemons', value: this.daemons },
                { name: 'Scheduled Jobs', value: this.scheduledJobs },
                { name: 'Workers', value: this.workers },
                { name: 'Configuration Files', value: this.configurationFiles },
                { name: 'Server Logs', value: this.serverLogs },
                { name: 'Deployment', value: this.deployment },
                { name: 'Git Projects', value: this.gitProjects },
                { name: 'SSH Keys', value: this.sshKeys },
                { name: 'Recipes', value: this.recipes },
                new inquirer.Separator(''),
                { name: 'Settings', value: this.settings },
                { name: 'About', value: this.about },
                { name: 'Clear', value: this.clear },
                new inquirer.Separator(''),
                { name: 'Exit', value: this.flyAway },
            ],
        },
    ])
    .then((answer) => {
        answer.action();
    });
};

exports.servers = () => {
    inquirer.prompt([
        {
            type: 'list',
            loop: false,
            name: 'action',
            message: "Select an option below...",
            choices: [
                new inquirer.Separator(''),
                { name: '<--', value: this.main },
                { name: 'Create server', value: servers.createServer },
                { name: 'List servers', value: servers.listServers },
                { name: 'Get server', value: servers.getServer },
                { name: 'Delete server', value: servers.deleteServer },
                { name: '<--', value: this.main },
            ],
        },
    ])
    .then((answer) => {
        answer.action();
    });
};

exports.sites = () => {
    inquirer.prompt([
        {
            type: 'list',
            loop: false,
            name: 'action',
            message: "Select an option below...",
            choices: [
                new inquirer.Separator(''),
                { name: '<--', value: this.main },
                { name: 'Create site', value: sites.createSite },
                { name: 'List sites', value: sites.listSites },
                { name: 'Get site', value: sites.getSite },
                { name: 'Delete site', value: sites.deleteSite },
                { name: '<--', value: this.main },
            ],
        },
    ])
    .then((answer) => {
        answer.action();
    });
};

exports.services = () => {
    inquirer.prompt([
        {
            type: 'list',
            loop: false,
            name: 'action',
            message: "Select an option below...",
            choices: [
                new inquirer.Separator(''),
                { name: '<--', value: this.main },
                { name: 'Reboot Nginx', value: services.rebootNginx },
                { name: 'Reboot PHP', value: services.rebootPhp },
                { name: 'Reboot MySQL', value: services.rebootNginx },
                { name: '<--', value: this.main },
            ],
        },
    ])
    .then((answer) => {
        answer.action();
    });
};

exports.firewallRules = () => {
    const choices = [
        new inquirer.Separator(''),
        { name: '<--', value: this.main },
        { name: 'Create rule', value: firewallRules.createRule },
        { name: 'List rules', value: firewallRules.listRules },
        { name: 'Delete rule', value: firewallRules.deleteRule },
        { name: '<--', value: this.main },
    ];

    inquirer.prompt([
        {
            type: 'list',
            loop: false,
            name: 'action',
            message: "Select an option below...",
            choices: choices,
        },
    ])
    .then((answer) => {
        answer.action();
    });
};

exports.daemons = () => {
    const choices = [
        new inquirer.Separator(''),
        { name: '<--', value: this.main },
        { name: 'Create Daemon', value: daemons.createDaemon },
        { name: 'List Daemons', value: daemons.listDaemons },
        { name: 'Delete Daemon', value: daemons.deleteDaemon },
        { name: 'Restart Daemon', value: daemons.restartDaemon },
        { name: '<--', value: this.main },
    ];

    inquirer.prompt([
        {
            type: 'list',
            loop: false,
            name: 'action',
            message: "Select an option below...",
            choices: choices,
        },
    ])
    .then((answer) => {
        answer.action();
    });
};

exports.scheduledJobs = () => {
    const choices = [
        new inquirer.Separator(''),
        { name: '<--', value: this.main },
        { name: 'Create Job', value: scheduledJobs.createJob },
        { name: 'List Jobs', value: scheduledJobs.listJobs },
        { name: 'Delete Job', value: scheduledJobs.deleteJob },
        { name: '<--', value: this.main },
    ];

    inquirer.prompt([
        {
            type: 'list',
            loop: false,
            name: 'action',
            message: "Select an option below...",
            choices: choices,
        },
    ])
    .then((answer) => {
        answer.action();
    });
};

exports.workers = () => {
    const choices = [
        new inquirer.Separator(''),
        { name: '<--', value: this.main },
        { name: 'Create Worker', value: workers.createWorker },
        { name: 'List Workers', value: workers.listWorkers },
        { name: 'Get Worker', value: workers.getWorker },
        { name: 'Delete Worker', value: workers.deleteWorker },
        { name: 'Restart Worker', value: workers.restartWorker },
        { name: '<--', value: this.main },
    ];

    inquirer.prompt([
        {
            type: 'list',
            loop: false,
            pageSize: 10,
            name: 'action',
            message: "Select an option below...",
            choices: choices,
        },
    ])
    .then((answer) => {
        answer.action();
    });
};

exports.configurationFiles = () => {
    const choices = [
        new inquirer.Separator(''),
        { name: '<--', value: this.main },
        { name: 'Get Nginx Configuration', value: configurationFiles.getNginxConfiguration },
        { name: 'Update Nginx Configuration', value: configurationFiles.updateNginxConfiguration },
        { name: 'Get Environment File', value: configurationFiles.getEnvironmentFile },
        { name: 'Update Environment File', value: configurationFiles.updateEnvironmentFile },
        { name: '<--', value: this.main },
    ];

    inquirer.prompt([
        {
            type: 'list',
            loop: false,
            name: 'action',
            message: "Select an option below...",
            choices: choices,
        },
    ])
    .then((answer) => {
        answer.action();
    });
};

exports.serverLogs = () => {
    const choices = [
        new inquirer.Separator(''),
        { name: '<--', value: this.main },
        { name: 'Get server logs', value: serverLogs.getServerLogs },
        { name: '<--', value: this.main },
    ];

    inquirer.prompt([
        {
            type: 'list',
            loop: false,
            name: 'action',
            message: "Select an option below...",
            choices: choices,
        },
    ])
    .then((answer) => {
        answer.action();
    });
};

exports.deployment = () => {
    const choices = [
        new inquirer.Separator(''),
        { name: '<--', value: this.main },
        { name: 'Enable Quick Deployment', value: deployment.enableQuickDeployment },
        { name: 'Disable Quick Deployment', value: deployment.disableQuickDeployment },
        { name: 'Get Deployment Script', value: deployment.getDeploymentScript },
        { name: 'Update Deployment Script', value: deployment.updateDeploymentScript },
        { name: 'Deploy Now', value: deployment.deployNow },
        { name: 'Reset Deployment Status', value: deployment.resetDeploymentStatus },
        { name: 'Get Deployment Log', value: deployment.getDeploymentLog },
        { name: '<--', value: this.main },
    ];

    inquirer.prompt([
        {
            type: 'list',
            loop: false,
            pageSize: 10,
            name: 'action',
            message: "Select an option below...",
            choices: choices,
        },
    ])
    .then((answer) => {
        answer.action();
    });
};

exports.gitProjects = () => {
    const choices = [
        new inquirer.Separator(''),
        { name: '<--', value: this.main },
        { name: 'Install New Repository', value: gitProjects.installNewRepository },
        { name: 'Remove Project', value: gitProjects.removeRepository },
        { name: '<--', value: this.main },
    ];

    inquirer.prompt([
        {
            type: 'list',
            loop: false,
            name: 'action',
            message: "Select an option below...",
            choices: choices,
        },
    ])
    .then((answer) => {
        answer.action();
    });
};

exports.sshKeys = () => {
    const choices = [
        new inquirer.Separator(''),
        { name: '<--', value: this.main },
        { name: 'Create Key', value: sshKeys.createKey },
        { name: 'List Keys', value: sshKeys.listKeys },
        { name: 'Delete Key', value: sshKeys.deleteKey },
        { name: '<--', value: this.main },
    ];

    inquirer.prompt([
        {
            type: 'list',
            loop: false,
            name: 'action',
            message: "Select an option below...",
            choices: choices,
        },
    ])
    .then((answer) => {
        answer.action();
    });
};

exports.recipes = () => {
    const choices = [
        new inquirer.Separator(''),
        { name: '<--', value: this.main },
        { name: 'Create Recipe', value: recipes.createRecipe },
        { name: 'List Recipes', value: recipes.listRecipes },
        { name: 'Get Recipe', value: recipes.getRecipe },
        { name: 'Update Recipe', value: recipes.updateRecipe },
        { name: 'Delete Recipe', value: recipes.deleteRecipe },
        { name: 'Run Recipe', value: recipes.runRecipe },
        { name: '<--', value: this.main },
    ];

    inquirer.prompt([
        {
            type: 'list',
            loop: false,
            pageSize: 10,
            name: 'action',
            message: "Select an option below...",
            choices: choices,
        },
    ])
    .then((answer) => {
        answer.action();
    });
};

exports.settings = () => {
    const choices = [
        new inquirer.Separator(''),
        { name: '<--', value: this.main },
        { name: 'Set Forge API key', value: settings.setApiKey },
        { name: 'Remove Forge API key', value: settings.removeApiKey },
    ];

    inquirer.prompt([
        {
            type: 'list',
            loop: false,
            name: 'action',
            message: "Select an option below...",
            choices: choices,
        },
    ])
    .then((answer) => {
        answer.action();
    });
};

exports.about = () => {
    console.log(`
 Forgery 0.3.0 by Andrew James Bibby
 Github: https://github.com/andrewjamesbibby/forgery
 Twitter: @andrewjbibby
 Licence: MIT
    `);
    this.main();
};

exports.clear = () => {
    console.clear();
    this.main();
};

exports.flyAway = () => {
    console.clear();
    console.log('');
    console.log(`👋 Goodbye, see you next time...`);
    console.log('');
    process.exit();
};




