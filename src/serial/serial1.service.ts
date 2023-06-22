import { Injectable, Logger } from '@nestjs/common';
import { SerialPort } from 'serialport';
import { DelimiterParser } from '@serialport/parser-delimiter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SocketService } from 'src/socket/socket.service';

interface Payload {
  data: any[];
  dt: Date | string;
}

@Injectable()
export class Serial1Service {
  private device;
  private deviceParser;
  private payload: Payload[] = [];
  private logger = new Logger('Vibration Sensor');
  constructor(private socket: SocketService) {
    try {
      this.device = new SerialPort({
        path: '/dev/ttyS2',
        baudRate: 115200,
      });
      this.deviceParser = this.device.pipe(
        new DelimiterParser({ delimiter: '\r\n' }),
      );
      this.deviceParser.on('data', this.onDeviceData.bind(this));
    } catch (error) {
      console.log(error);
    }

    // setInterval(() => {
    //   this.fakeData();
    // }, 500);
  }
  // fakeData() {
  //   this.socket.send('vibration', JSON.stringify(this.payload));
  //   this.payload = [];
  // }

  @Cron(CronExpression.EVERY_SECOND)
  fakeData() {
    this.socket.send('vibration', JSON.stringify(this.payload));
    console.log(this.payload.length);
    this.payload = [];
  }

  onDeviceData(data: any) {
    //wconsole.log('data: ', data.toString());
    const payload = data.toString().split(',');
    this.socket.send('vibration', JSON.stringify(this.payload));

    const date = new Date();
    this.payload.push({
      data: payload,
      dt: date.getMinutes() + ':' + date.getSeconds(),
    });
  }
}
