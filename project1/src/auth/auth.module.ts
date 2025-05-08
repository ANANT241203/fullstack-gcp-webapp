import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { GcsService } from './gcs.service';
import { FileEventsGateway } from './file-events.gateway';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your_jwt_secret', // In production, use environment variables
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GcsService, FileEventsGateway],
})
export class AuthModule {}
