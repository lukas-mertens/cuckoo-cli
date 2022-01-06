import {Command, Flags} from '@oclif/core'
import {Cuckoo} from '../../cuckoo-api-wrapper'

export default class Work extends Command {
  static description = 'Start working'

  static examples = [
    '$ cuckoo-cli work my-session-name 25',
  ]

  static flags = {};

  static args = [{name: 'session', description: 'The session to join', required: true}, {name: 'duration', description: 'the duration in minutes', required: true}];

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Work)

    this.log(`Setting timer in session ${args.session} to ${args.duration}`)
    const c = new Cuckoo();
    c.connect(args.session);
    c.startWork(args.duration).then(() => {
      c.disconnect();
    });
  }
}
