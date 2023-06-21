import { Injectable, Logger } from '@nestjs/common';
import { SerialPort } from 'serialport';
import { DelimiterParser } from '@serialport/parser-delimiter';
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

  onDeviceData(data: any) {
    //wconsole.log('data: ', data.toString());
    const payload = data.toString().split(',');

    const message = {
      data: payload,
      dt: new Date(),
    };
    this.socket.send('vibration', JSON.stringify(message));
  }
}
