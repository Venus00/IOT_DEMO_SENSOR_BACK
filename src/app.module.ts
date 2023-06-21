import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { SerialModule } from './serial/serial.module';
import { SocketModule } from './socket/socket.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [SerialModule, SocketModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
