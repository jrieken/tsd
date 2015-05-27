#!/usr/bin/env node

import program = require('commander')
// import { uninstall } from '../tsd'

program
  .option('-S, --save', 'save as a dependency')
  .option('-A, --save-ambient', 'save as an ambient dependency')
  .option('-D, --save-dev', 'save as a development dependency')
  .parse(process.argv)

interface ArgvOptions {
  save: boolean
  saveDev: boolean
  saveAmbient: boolean
}

const opts: ArgvOptions = program.opts()

// uninstall(program.args[0], opts)
