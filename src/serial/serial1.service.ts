import { Injectable, Logger } from '@nestjs/common';
import { SerialPort } from 'serialport';
import { DelimiterParser } from '@serialport/parser-delimiter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class Serial1Service {
  private device;
  private deviceParser;
  private logger = new Logger('Vibration Sensor');
  constructor(private socket: SocketService) {
    try {
      this.device = new SerialPort({
        path: '/dev/ttyS2',
        baudRate: 115200,
      });
      this.deviceParser = this.device.pipe(
        new DelimiterParser({ delimiter: '\n' }),
      );
      this.deviceParser.on('data', this.onDeviceData.bind(this));
    } catch (error) {
      console.log(error);
    }
  }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // fakeData() {
  //   const paylaod = {
  //     ax: Math.floor(Math.random() * 10),
  //     ay: Math.floor(Math.random() * 10),
  //     az: Math.floor(Math.random() * 10),
  //     dt: new Date(),
  //   };
  //   this.logger.log(paylaod);
  //   this.socket.send('vibration', JSON.stringify(paylaod));
  // }
  onDeviceData(data: any) {
    //wconsole.log('data: ', data.toString());
    const payload = data.toString().split(',');

    const message = {
      data: payload,
      dt: new Date(),
    };
    this.socket.send('vibration', JSON.stringify(message));
    // this.logger.log('ax', payload[0]);
    // this.logger.log('ay', payload[1]);
    // this.logger.log('az', payload[2]);
  }
}
