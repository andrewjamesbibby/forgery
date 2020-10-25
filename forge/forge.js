const axios = require('axios');
const configStore = require('configstore');
const config = new configStore('forgery');
const forge_api_key = config.get('forge.api_key');

axios.defaults.headers = {
    'Authorization' : `Bearer ${forge_api_key}`,
    'Accept' : 'application/json'
};

exports.listServers = () => {
    return axios.get('https://forge.laravel.com/api/v1/servers');
};

exports.getServer = (serverId) => {
    return axios.get(`https://forge.laravel.com/api/v1/servers/${serverId}`);
};

exports.createServer = (data = {}) => {
    return axios.post(`https://forge.laravel.com/api/v1/servers`, data);
};

exports.deleteServer = (serverId) => {
    return axios.delete(`https://forge.laravel.com/api/v1/servers/${serverId}`);
};

exports.getCredentials = () => {
    return axios.get('https://forge.laravel.com/api/v1/credentials');
};

exports.getRegions = () => {
    return axios.get('https://forge.laravel.com/api/v1/regions');
};

exports.createSite = (serverId, data = {}) => {
    return axios.post(`https://forge.laravel.com/api/v1/servers/${serverId}/sites`, data);
};

exports.listSites = () => {
    return axios.get('https://forge.laravel.com/api/v1/sites');
};

exports.deleteSite = (serverId, siteId) => {
    return axios.delete(`https://forge.laravel.com/api/v1/servers/${serverId}/sites/${siteId}`);
};

exports.rebootNginx = (serverId) => {
    return axios.post(`https://forge.laravel.com/api/v1/servers/${serverId}/nginx/reboot`);
};

exports.rebootPhp = (serverId, data = {}) => {
    return axios.post(`https://forge.laravel.com/api/v1/servers/${serverId}/php/reboot`, data);
};

exports.rebootMysql = (serverId) => {
    return axios.post(`https://forge.laravel.com/api/v1/servers/${serverId}/mysql/reboot`);
};

exports.createRule = (serverId, data = {}) => {
    return axios.post(`https://forge.laravel.com/api/v1/servers/${serverId}/firewall-rules`, data);
};

exports.listRules = (serverId) => {
    return axios.get(`https://forge.laravel.com/api/v1/servers/${serverId}/firewall-rules`);
};

exports.deleteRule = (serverId, ruleId) => {
    return axios.delete(`https://forge.laravel.com/api/v1/servers/${serverId}/firewall-rules/${ruleId}`);
};

exports.createDaemon = (serverId, data) => {
    return axios.post(`https://forge.laravel.com/api/v1/servers/${serverId}/daemons`, data);
};

exports.listDaemons = (serverId) => {
    return axios.get(`https://forge.laravel.com/api/v1/servers/${serverId}/daemons`);
};

exports.deleteDaemon = (serverId, daemonId) => {
    return axios.delete(`https://forge.laravel.com/api/v1/servers/${serverId}/daemons/${daemonId}`);
};

exports.restartDaemon = (serverId, daemonId) => {
    return axios.post(`https://forge.laravel.com/api/v1/servers/${serverId}/daemons/${daemonId}/restart`);
};

exports.createJob = (serverId, data) => {
    return axios.post(`https://forge.laravel.com/api/v1/servers/${serverId}/jobs`, data);
};

exports.listJobs = (serverId) => {
    return axios.get(`https://forge.laravel.com/api/v1/servers/${serverId}/jobs`);
};

exports.deleteJob = (serverId, jobId) => {
    return axios.delete(`https://forge.laravel.com/api/v1/servers/${serverId}/jobs/${jobId}`);
};

exports.createWorker = (serverId, siteId, data) => {
    return axios.post(`https://forge.laravel.com/api/v1/servers/${serverId}/sites/${siteId}/workers`, data);
};

exports.listWorkers = (serverId, siteId) => {
    return axios.get(`https://forge.laravel.com/api/v1/servers/${serverId}/sites/${siteId}/workers`);
};

exports.getWorker = (serverId, siteId, workerId) => {
    return axios.get(`https://forge.laravel.com/api/v1/servers/${serverId}/sites/${siteId}/workers/${workerId}`);
};

exports.deleteWorker = (serverId, siteId, workerId) => {
    return axios.delete(`https://forge.laravel.com/api/v1/servers/${serverId}/sites/${siteId}/workers/${workerId}`);
};

exports.restartWorker = (serverId, siteId, workerId) => {
    return axios.post(`https://forge.laravel.com/api/v1/servers/${serverId}/sites/${siteId}/workers/${workerId}/restart`);
};

exports.getNginxConfiguration = (serverId, siteId) => {
    return axios.get(`https://forge.laravel.com/api/v1/servers/${serverId}/sites/${siteId}/nginx`);
};

exports.updateNginxConfiguration = (serverId, siteId, data) => {
    return axios.put(`https://forge.laravel.com/api/v1/servers/${serverId}/sites/${siteId}/nginx`, data);
};

exports.getEnvironmentFile = (serverId, siteId) => {
    return axios.get(`https://forge.laravel.com/api/v1/servers/${serverId}/sites/${siteId}/env`);
};

exports.updateEnvironmentFile = (serverId, siteId, data) => {
    return axios.put(`https://forge.laravel.com/api/v1/servers/${serverId}/sites/${siteId}/env`, data);
};

exports.getServerLogs = (serverId, file) => {
    return axios.get(`https://forge.laravel.com/api/v1/servers/${serverId}/logs?file=${file}`);
};

exports.enableQuickDeployment = (serverId, siteId) => {
    return axios.post(`https://forge.laravel.com/api/v1/servers/${serverId}/sites/${siteId}/deployment`);
};

exports.disableQuickDeployment = (serverId, siteId) => {
    return axios.delete(`https://forge.laravel.com/api/v1/servers/${serverId}/sites/${siteId}/deployment`);
};

exports.getDeploymentScript = (serverId, siteId) => {
    return axios.get(`https://forge.laravel.com/api/v1/servers/${serverId}/sites/${siteId}/deployment/script`);
};

exports.updateDeploymentScript = (serverId, siteId, data) => {
    return axios.put(`https://forge.laravel.com/api/v1/servers/${serverId}/sites/${siteId}/deployment/script`, data);
};

exports.deployNow = (serverId, siteId) => {
    return axios.post(`https://forge.laravel.com/api/v1/servers/${serverId}/sites/${siteId}/deployment/deploy`);
};

exports.resetDeploymentStatus = (serverId, siteId) => {
    return axios.post(`https://forge.laravel.com/api/v1/servers/${serverId}/sites/${siteId}/deployment/reset`);
};

exports.getDeploymentLog = (serverId, siteId) => {
    return axios.get(`https://forge.laravel.com/api/v1/servers/${serverId}/sites/${siteId}/deployment/log`);
};

exports.installNewRepository = (serverId, siteId, data) => {
    return axios.post(`https://forge.laravel.com/api/v1/servers/${serverId}/sites/${siteId}/git`, data);
};

exports.removeRepository = (serverId, siteId) => {
    return axios.delete(`https://forge.laravel.com/api/v1/servers/${serverId}/sites/${siteId}/git`);
};

exports.createKey = (serverId, data) => {
    return axios.post(`https://forge.laravel.com/api/v1/servers/${serverId}/keys`, data);
};

exports.listKeys = (serverId) => {
    return axios.get(`https://forge.laravel.com/api/v1/servers/${serverId}/keys`);
};

exports.deleteKey = (serverId, keyId) => {
    return axios.delete(`https://forge.laravel.com/api/v1/servers/${serverId}/keys/${keyId}`);
};

exports.createRecipe = (data) => {
    return axios.post(`https://forge.laravel.com/api/v1/recipes`, data);
};

exports.listRecipes = () => {
    return axios.get(`https://forge.laravel.com/api/v1/recipes`);
};

exports.getRecipe = (recipeId) => {
    return axios.get(`https://forge.laravel.com/api/v1/recipes/${recipeId}`);
};

exports.updateRecipe = (recipeId, data) => {
    return axios.put(`https://forge.laravel.com/api/v1/recipes/${recipeId}`, data);
};

exports.deleteRecipe = (recipeId) => {
    return axios.delete(`https://forge.laravel.com/api/v1/recipes/${recipeId}`);
};

exports.runRecipe = (recipeId, data) => {
    return axios.post(`https://forge.laravel.com/api/v1/recipes/${recipeId}/run`, data);
};