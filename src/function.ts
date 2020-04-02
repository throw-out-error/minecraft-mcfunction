import { mkdirIfNotExist } from './utility'
import fs from 'fs'
import { dirname as getDirname } from 'path'
import { Command } from "./commands";
export * from "./arguments";
export * from "./commands";

export class McFunction {
  commands: Command[]
  path: string
  /**
   * @param {string} path the path of the file relative to namspace/functions
   * @param {Command[]} commands the commands of the file in an array
   */
  constructor(path: string,commands:Command[]) {
    this.path = path;
    this.commands = commands;
  }
  compile(path: string) {
    let functionPath = `${path}/${this.path}.mcfunction`
    mkdirIfNotExist(getDirname(functionPath))
    fs.writeFileSync(
      functionPath,
      this.commands.map(c => c.compile()).join('\n')
    )
  }
  /**
   * Add a command to the function
   * @param {Command} command the command to be added
   * @deprecated pass the commands as an array to the constructor instead
   */
  addCommand(command: Command) {
  }
  /**
   * Copies the function
   * @param {McFunction} funct the function to be copied
   * @returns {McFunction} a reference to the function
   */
  static copy(funct: McFunction): McFunction {
    let copy = new McFunction('_',[]);
    for (let key of Object.getOwnPropertyNames(funct)) copy[key] = funct[key]
    return copy
  }
}
