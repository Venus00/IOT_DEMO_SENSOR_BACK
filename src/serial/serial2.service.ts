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
    }, 100);
  }
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
      this.logger.log(stdout);
      if (stdout === '0') {
        console.log('button pressed');
      }
      return null;
    });
    exec(`sudo gpio-test.64 r b 13`, (error, stdout, stderr) => {
      if (error) {
        this.logger.error(`error: ${error.message}`);
        return error.message;
      }
      if (stderr) {
        this.logger.error(`stderr: ${stderr}`);
        return null;
      }
      this.logger.log(stdout);
      if (stdout === '1') {
        console.log('button pressed');
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
