import { Injectable, Logger } from '@nestjs/common';
import { SerialPort } from 'serialport';
import { DelimiterParser } from '@serialport/parser-delimiter';
import { SocketService } from 'src/socket/socket.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';

@Injectable()
export class Serial2Service {
  private device;
  private deviceParser;
  private button1 = false;
  private button2 = false;

  private logger = new Logger('Serial SENSORS Device');
  constructor(private socket: SocketService) {
    try {
      this.device = new SerialPort({
        path: '/dev/ttyS3',
        baudRate: 115200,
      });
      this.deviceParser = this.device.pipe(
        new DelimiterParser({ delimiter: '\n' }),
      );
      this.deviceParser.on('data', this.onDeviceData.bind(this));
    } catch (error) {
      console.log(error);
    }
    setInterval(() => {
      this.readButton();
    }, 500);
  }
  //@Cron(CronExpression.EVERY_SECOND)
  readButton() {
    exec(`sudo gpio-test.64 r h 19`, (error, stdout, stderr) => {
      if (error) {
        this.logger.error(`error: ${error.message}`);
        return error.message;
      }
      if (stderr) {
        this.logger.error(`stderr: ${stderr}`);
        return null;
      }
      if (stdout[16] === '0' && !this.button1) {
        this.button1 = true;
        console.log('button1 pressed');
        this.socket.send('pressure', 'testOK');
      } else {
        this.button1 = false;
      }
      return null;
    });
    exec(`sudo gpio-test.64 r h 13`, (error, stdout, stderr) => {
      if (error) {
        this.logger.error(`error: ${error.message}`);
        return error.message;
      }
      if (stderr) {
        this.logger.error(`stderr: ${stderr}`);
        return null;
      }
      if (stdout[16] === '0' && !this.button2) {
        this.button2 = true;
        this.socket.send('fuel', 'testOK');
      } else {
        this.button2 = false;
      }
      return null;
    });
  }

  onDeviceData(data: any) {
    const payload = data.toString();
    this.logger.log('sensor payload', payload);
    this.socket.send('sensor', payload);
  }
}
