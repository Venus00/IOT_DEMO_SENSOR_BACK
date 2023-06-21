import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { SerialModule } from './serial/serial.module';
import { SocketModule } from './socket/socket.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        '..',
        '..',
        'IOT_DEMO_SENSOR_FRONT',
        'build',
      ),
    }),
    SerialModule,
    SocketModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
