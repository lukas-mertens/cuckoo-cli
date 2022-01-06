import * as fs from 'fs'
import * as os from 'os';

export const configDirectory = `${os.homedir()}/.config/cuckoo-cli`;
export const configPath = `${configDirectory}/config.json`;
export type configType = {defaultSession: string, defaultWorkTime: number, defaultBreakTime: number, defaultName: string, defaultEmail: string};
export let config: configType;

if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
} else {
  config = {
    defaultBreakTime: 5,
    defaultWorkTime: 25,
    defaultName: 'CLI-User',
    defaultEmail: 'cli@example.org',
    defaultSession: 'cuckoo-cli'
  }
}

