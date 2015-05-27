import * as fs from 'graceful-fs'
import thenify = require('thenify')
import stripBom = require('strip-bom')
import parseJson = require('parse-json')
import popsicle = require('popsicle')
import popsicleCache = require('popsicle-cache')
import popsicleStatus = require('popsicle-status')
import detectIndent = require('detect-indent')
import { isHttp } from './path'
import { TsdJson } from '../interfaces/tsd'

// Create a file cache for popsicle.
const FILE_CACHE = popsicleCache()

export let Stats: fs.Stats

export const stat = thenify(fs.stat)
export const readFile = thenify<string, string, string>(fs.readFile)
export const writeFile = thenify<string, string | Buffer, void>(fs.writeFile)

export function isFile (path: string): Promise<boolean> {
  return stat(path).then(stat => stat.isFile(), () => false)
}

export function readJson (path: string): Promise<any> {
  return readFile(path, 'utf8')
    .then(stripBom)
    .then(contents => parseJson(contents, null, path))
}

export function writeJson (path: string, json: any, indent: string | number = 2) {
  return writeFile(path, JSON.stringify(json, null, indent))
}

export function readTsd (path: string): Promise<TsdJson> {
  return readJson(path)
}

export function readTsdFrom (path: string): Promise<TsdJson> {
  return readJsonFrom(path) // TODO: Provide more insightful issues with TSD file reading.
}

export function writeTsd (path: string, tsd: TsdJson, indent: string | number = 2) {
  return writeJson(path, tsd, indent) // TODO: Make modifications to standardise JSON (sort dependencies, etc.)
}

export function readHttp (url: string): Promise<string> {
  return popsicle(url)
    .then(FILE_CACHE)
    .then(popsicleStatus())
    .then(x => x.body)
}

export function readFileFrom (from: string): Promise<string> {
  return isHttp(from) ? readHttp(from) : readFile(from, 'utf8')
}

export function readJsonFrom (from: string): Promise<any> {
  return readFileFrom(from)
    .then(stripBom)
    .then(contents => parseJson(contents, null, from))
}

export function transformJson <T> (src: string, transform: (src: T) => T) {
  return readFile(src, 'utf8')
    .then(function (contents) {
      const json = parseJson(contents, null, src)
      const indent = detectIndent(contents).indent || 2

      return Promise.resolve(transform(json))
        .then(json => writeJson(src, json, indent))
    })
}
