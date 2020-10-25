#!/usr/bin/env node

const figlet = require('figlet');
const menu  = require('../menu');
const chalk = require('chalk');

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
  Forgery 0.3.0 by Andrew James Bibby
    `);

    menu.main();
});




