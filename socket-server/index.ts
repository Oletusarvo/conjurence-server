import { Server } from 'socket.io';
import eventPositionUpdateHandler from './lib/event-position-update-handler';
import joinRoomHandler from './lib/join-room-handler';
import leaveRoomHandler from './lib/leave-room-handler';

export const socketServer = (io: Server) => {
  io.on('connection', socket => {
    console.log('New connection: ', socket.id);

    socket.on('join_room', async roomName => await joinRoomHandler(io, socket, roomName));

    socket.on('leave_room', roomName => leaveRoomHandler(io, socket, roomName));

    //Ran when the location of a user changes while hosting a mobile event.
    socket.on(
      'event:position_update',
      async payload => await eventPositionUpdateHandler(io, socket, payload)
    );
  });
};
