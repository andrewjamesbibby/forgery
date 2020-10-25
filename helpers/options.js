const forge = require('../forge/forge');

const serverChoices = async () => {

    let choices = [];
    const servers = await forge.listServers();

    servers.data.servers.forEach(server => {
        choices.push({ name: server.name, value: server });
    });

    return choices;
};

const siteChoices = async () => {

    let choices = [];
    const sites = await forge.listSites();

    sites.data.sites.forEach(site => {
        choices.push({ name: site.name, value: site });
    });

    return choices;
};

const recipeChoices = async () => {

    let choices = [];
    const recipes = await forge.listRecipes();

    recipes.data.recipes.forEach(recipe => {
        choices.push({ name: recipe.name, value: recipe });
    });

    return choices;
};

module.exports = {
    serverChoices,
    siteChoices,
    recipeChoices,
};
