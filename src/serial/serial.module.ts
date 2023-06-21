import { Module } from '@nestjs/common';
import { Serial1Service } from './serial1.service';
import { Serial2Service } from './serial2.service';
import { SocketModule } from 'src/socket/socket.module';
@Module({
  imports: [SocketModule],
  providers: [Serial1Service, Serial2Service],
})
export class SerialModule {}
