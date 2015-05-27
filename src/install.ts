import dependencies from './lib/dependencies'
import compile from './lib/compile'
import { findProject } from './utils/find'

export interface Options {
  save?: boolean
  saveDev?: boolean
  saveAmbient?: boolean
  as?: string
  cwd?: string
}

export function install (options: Options = {}) {
  console.log(options)

  return findProject(options.cwd || process.cwd())
}

export function installDependency (dependency: string, options: Options = {}) {
  const cwd = options.cwd || process.cwd()

  return findProject(cwd)
    .then(
      function (path) {
        return installTo(cwd, dependency, options)
      },
      function () {
        return installTo(cwd, dependency, options)
      })
}

function installTo (cwd: string, dependency: string, options: Options) {
  console.log(cwd, dependency, options)
}
