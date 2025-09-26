import { Server, Socket } from 'socket.io';

export default async function leaveRoomHandler(io: Server, socket: Socket, roomName: string) {
  socket.leave(roomName);
}
