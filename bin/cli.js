#!/usr/bin/env node

const path = require('path');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));

const dev = require('../generator/dev');
const build = require('../generator/build');

const basedir = argv.basedir ? path.resolve(argv.basedir) : process.cwd();

const cmd = argv.watch ? dev : build;

cmd(basedir, argv.pagesdir);
