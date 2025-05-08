import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({ cors: true })
export class FileEventsGateway {
  @WebSocketServer()
  server: Server;

  emitFileUploaded(payload: { filename: string; user?: string }) {
    this.server.emit('fileUploaded', payload);
  }
}
