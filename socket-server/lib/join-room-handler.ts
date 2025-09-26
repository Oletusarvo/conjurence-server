import { Server, Socket } from 'socket.io';

export default async function joinRoomHandler(io: Server, socket: Socket, roomName: string) {
  socket.join(roomName);
}
