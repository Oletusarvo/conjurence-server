import { Server, Socket } from 'socket.io';
import db from '../../dbconfig';

export default async function eventPositionUpdateHandler(
  io: Server,
  socket: Socket,
  payload: { eventId: string; position: any; user_id: string }
) {
  const { eventId, position, user_id } = payload;
  const [newPositionRecord] = await db('positions.event_position')
    .where({ event_id: eventId })
    .where({ timestamp: null })
    .orWhere('timestamp', '<', position.timestamp)
    .update(
      {
        coordinates: db.raw(
          `ST_SetSRID(
                ST_MakePoint(
                  ?,
                  ?
                ),
                4326
              )::geography`,
          [position.coords.longitude, position.coords.latitude]
        ),
        timestamp: position.timestamp,
        accuracy: position.coords.accuracy,
      },
      'timestamp'
    );

  if (newPositionRecord) {
    //Omit broadcasting to the socket from which the position came.
    socket.to(`event:${payload.eventId}`).emit('event:position_update', { eventId, position });
  }
}
