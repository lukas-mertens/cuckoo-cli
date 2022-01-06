// @ts-ignore
import * as io from 'socket.io-client';
import * as notifier from 'node-notifier'
import {log} from 'oclif/lib/log'
import {config, configDirectory} from './config'
import * as fs from 'fs'
import * as chalk from 'chalk';


export class Cuckoo {
  private static connection: any;
  private static connectedUsers: any[];
  private static timer: {current: number, currentFormatted: string, currentProgress: number, totalDuration: number};
  private static loggedActivity: Date = new Date(0);
  private static flags: {
    isTimerActive: boolean,
    isTimerRunning: boolean,
    isTimerPaused: boolean,
    isTimerFinished: boolean,
    isBreakTime: boolean,
    isRoadmapActive: boolean,
    isRoadmapRunning: boolean,
    isRoadmapFinished: boolean,
    isMessageOnly: boolean,
  };

  private static logActivity(activity: any): void {
    console.log(chalk.green('[') + chalk.yellow(activity.user.fullname) + chalk.green(']') + ': ' + activity.message);
  }

  public registerListeners(): void {
    const socket = Cuckoo.connection;
    if (!socket)
      throw new Error('Join a session first!');

    socket.on('update activity', (data: any) => {
      Cuckoo.flags = {
        isTimerActive: data.flags._isTimerActive,
        isTimerRunning: data.flags._isTimerRunning,
        isTimerPaused: data.flags._isTimerPaused,
        isTimerFinished: data.flags._isTimerFinished,
        isBreakTime: data.flags._isBreakTime,
        isRoadmapActive: data.flags._isRoadmapActive,
        isRoadmapRunning: data.flags._isRoadmapRunning,
        isRoadmapFinished: data.flags._isRoadmapFinished,
        isMessageOnly: data.flags._isMessageOnly,
      };
      data.activity.forEach((activity: {date: string, message: string, user: {fullname: string}}) => {
        if (Cuckoo.loggedActivity.valueOf() < new Date(activity.date).valueOf()) {
          Cuckoo.logActivity(activity);
          Cuckoo.loggedActivity = new Date(activity.date);
        }
      });
      this.writei3BlocksStatus();
    });

    socket.on("ping", function() {
      socket.emit("pong");
    })

    socket.on("update timer", (data: any) => {
      Cuckoo.timer = {
        current: data.current,
        currentFormatted: data.currentFormatted,
        currentProgress: data.currentProgress,
        totalDuration: data.totalDuration,
      };
      this.writei3BlocksStatus();
    });

    socket.on('finish timer', () => {
      notifier.notify({
        title: `Timer finished!`,
        message: `Timer finished after ${Math.round(Cuckoo.timer.totalDuration/60)}min`
      })
    });
  }

  public async writei3BlocksStatus(): Promise<void> {
    let status;
    let emoji;
    if (Cuckoo?.flags.isTimerActive) {
      if (Cuckoo.flags.isTimerPaused) {
        emoji = `⏸`;
      } else if (Cuckoo.flags.isBreakTime) {
        emoji = `⏳`;
      } else {
        emoji = `💪`;
      }
      status = `${emoji} ${Cuckoo.timer?.currentFormatted ?? '???'}`;
    } else {
      status = `💤`;
    }
    fs.writeFileSync(`${configDirectory}/i3status`, `<span color="#00ff00">${status}</span>\n`, {encoding: 'utf-8'});
  }

  public async joinSession(session: string): Promise<void> {
    this.connect(session);
    await this.updateUsername(config.defaultName);
    await this.updateEmail(config.defaultEmail);
    this.registerListeners();
  }

  public connect(session: string): void {
    Cuckoo.connection = io(`wss://cuckoo.team/${session}`);
  }

  public disconnect(): void {
    Cuckoo.connection.disconnect();
  }

  public async startWork(timeInMinutes: number): Promise<void> {
    await Cuckoo.connection.emit('start timer', timeInMinutes);
  }

  public async updateUsername(username: string): Promise<void> {
    await Cuckoo.connection.emit('update user', username);
  }

  public async updateEmail(username: string): Promise<void> {
    await Cuckoo.connection.emit('change email', username);
  }

  public isConnected(): boolean {
    return !!Cuckoo.connection;
  }
}
