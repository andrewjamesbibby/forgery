const { handleError } = require('../helpers/errorHandler');
const notify = require('../helpers/notifications');
const options = require('../helpers/options');
const forge = require('../forge/forge');
const inquirer = require('inquirer');
const Table = require('cli-table3');
const menu = require('../menu');
const chalk = require('chalk');

const createRecipe = async () => {

    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Name:',
        },
        {
            type: 'input',
            name: 'user',
            message: 'User (e.g root):',
        },
        {
            type: 'editor',
            name: 'script',
            default: 'Put recipe content here...',
            message: "Add recipe script:",
        },
    ]).then(async (answers) => {
        try {
            const recipe = await forge.createRecipe(answers);
            console.log(recipe.data);
        } catch(error) {
            handleError(error);
        } finally {
            menu.recipes();
            return;
        }
    });

};

const listRecipes = async () => {
    try {
        const result = await forge.listRecipes();

        if(!result.data.recipes.length){
            notify.info('There are no recipes available.');
            return;
        }

        const table = new Table({
            head: [
                chalk.green('Recipe Id'),
                chalk.green('Name'),
                chalk.green('User'),
            ]
        });

        result.data.recipes.forEach((recipe) => {
            table.push([
                recipe.id,
                recipe.name,
                recipe.user,
            ]);
        });

        console.log(table.toString());
    } catch(error) {
        handleError(error);
    } finally {
        menu.recipes();
        return;
    }
};

const getRecipe = async () => {

    const choices = await options.recipeChoices();

    inquirer.prompt([
        {
            type: 'list',
            name: 'recipe',
            message: "Select a recipe to get:",
            choices: choices,
        },
    ]).then(async (answer) => {
        console.log(answer);
        menu.recipes();
    });

};

const updateRecipe = async () => {

    const choices = await options.recipeChoices();

    inquirer.prompt([
        {
            type: 'list',
            name: 'recipe',
            message: "Select a recipe to update:",
            choices: choices,
        },
        {
            type: 'editor',
            name: 'script',
            default: async (answer) => {
                const recipe = await forge.getRecipe(answer.recipe.id);
                return recipe.data.recipe.script;
            },
            message: "Update Recipe file:",
        },
    ]).then(async (answer) => {
        try {
            await forge.updateRecipe(answer.recipe.id, {
                script: answer.script,
            });
            notify.success('Recipe updated');
        } catch(error) {
            handleError(error);
        } finally {
            menu.recipes();
            return;
        }
    });

};

const deleteRecipe = async () => {

    const choices = await options.recipeChoices();

    inquirer.prompt([
        {
            type: 'list',
            name: 'recipe',
            message: "Select a recipe to delete:",
            choices: choices,
        },
    ]).then(async (answer) => {
        try {
            await forge.deleteRecipe(answer.recipe.id);
            notify.success('Recipe deleted');
        } catch(error) {
            handleError(error);
        } finally {
            menu.recipes();
            return;
        }
    });

};

const runRecipe = async () => {

    const recipeChoices = await options.recipeChoices();
    const serverChoices = await options.serverChoices();

    inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'recipe',
            message: "Select a recipe to run:",
            choices: recipeChoices,
            source: (answered, input) => {
                input = input || '';
                return recipeChoices.filter(choice => {
                    return choice.name.includes(input);
                });
            },
        },
        {
            type: 'checkbox',
            name: 'servers',
            message: "Select servers the recipe will run on:",
            choices: serverChoices,
            validate: (response) => {
                if(!response.length) {
                    return 'Select at least 1 server to run the recipe.';
                }
                return true;
            }
        },
        {
            type: 'list',
            name: 'notify',
            message: "Send Recipe Report via Email?",
            choices: [
                new inquirer.Separator(''),
                { name: 'No', value: false },
                { name: 'Yes', value: true },
            ]
        },
    ]).then(async (answer) => {
        try {
            const servers = answer.servers.map((server) => server.id);
            await forge.runRecipe(answer.recipe.id, {
                servers,
                notify: answer.notify
            });
            notify.success('Recipe triggered');
        } catch(error) {
            handleError(error);
        } finally {
            menu.recipes();
            return;
        }
    });

};

module.exports = {
    createRecipe,
    listRecipes,
    getRecipe,
    updateRecipe,
    deleteRecipe,
    runRecipe,
};
