import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@Injectable()
export class SocketService implements OnModuleInit {
  private io: Server;

  private logger = new Logger('SOCKETIO');

  onModuleInit() {
    this.io = new Server({
      cors: {
        origin: '*',
      },
    });
    this.io.listen(5000, {
      cors: { origin: '*' },
    });
    this.io.on('connection', this.onConnect.bind(this));
    this.io.on('message', this.onMessage.bind(this));
    this.io.on('error', this.logger.error);
  }

  onConnect() {
    this.logger.log('new Socket Client Connected!');
  }

  onMessage(data: string) {
    this.logger.log(data);
  }

  send(topic: string, message: string) {
    this.io.emit(topic, message);
  }
}
