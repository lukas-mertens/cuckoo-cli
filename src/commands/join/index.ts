import {Command, Flags} from '@oclif/core'
import {Cuckoo} from '../../cuckoo-api-wrapper'
import {config} from '../../config'

export default class Join extends Command {
  static description = 'Join a pomodoro session'

  static examples = [
    '$ cuckoo-cli join my-session-name',
  ]

  static flags = {};

  static args = [{name: 'session', description: 'The session to join', required: false}];

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Join)
    const session = args?.session ?? config.defaultSession;

    this.log(`Joining session ${session}`)
    new Cuckoo().joinSession(session);
  }
}
