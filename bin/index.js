#!/usr/bin/env node

const figlet = require('figlet');
const menu  = require('../menu');
const chalk = require('chalk');
const fs = require('fs');

let package = fs.readFileSync( `${__dirname}/../package.json`, 'utf8');
package = JSON.parse(package);

figlet.text('Forgery', {
    font: 'Big',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
}, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }

    console.log(chalk.green(data));

    console.log(`
        by Andrew James Bibby
                ${package.version}
    `);

    menu.main();
});




