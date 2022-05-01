import {Command, Flags, CliUx} from '@oclif/core'
import {config, configDirectory, configPath, configType} from '../../config'
import * as fs from 'fs'

export default class Setup extends Command {
  static description = 'Run config setup'

  static examples = [
    '$ cuckoo-cli setup',
  ]

  static flags = {};

  static args = [];

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Setup)

    this.log(`Running setup...`)
    const newConfig: configType = {
      defaultWorkTime: await CliUx.ux.prompt('What should should be the default work time?', {default: config.defaultWorkTime.toString()}),
      defaultBreakTime: await CliUx.ux.prompt('What should be the default breaktime in minutes?', {default: config.defaultBreakTime.toString()}),
      defaultName: await CliUx.ux.prompt('What should should be your name?', {default: config.defaultName}),
      defaultEmail: await CliUx.ux.prompt('What should should be your email?', {default: config.defaultEmail}),
      defaultSession: await CliUx.ux.prompt('What should should be your default session?', {default: config.defaultSession}),
    };
    fs.mkdirSync(configDirectory, {recursive: true}),
    fs.writeFileSync(configPath, JSON.stringify(newConfig), {encoding: 'utf-8'});
  }
}
