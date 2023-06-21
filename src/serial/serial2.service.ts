import { Injectable, Logger } from '@nestjs/common';
import { SerialPort } from 'serialport';
import { DelimiterParser } from '@serialport/parser-delimiter';

@Injectable()
export class Serial2Service {
  private device;
  private deviceParser;
  private logger = new Logger('Serial SENSORS Device');
  constructor() {
    try {
      this.device = new SerialPort({
        path: '/dev/ttyS1',
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

  onDeviceData(data: any) {
    console.log('data: ', data.toString());
    const payload = JSON.parse(data.toString());
    this.logger.log('sensor payload', payload);
  }
}
