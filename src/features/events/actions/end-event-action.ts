'use server';

import db from '@/dbconfig';
import { loadSession } from '@/util/load-session';
import z from 'zod';
import { eventService } from '../services/event-service';

/**Ends an event, deleting it.
 * @event_id The instance id of the event to delete. If the data for the instance is a template, only the instance is deleted.
 */

export async function endEventAction(event_id: string): Promise<ActionResponse<void, string>> {
  const trx = await db.transaction();
  try {
    z.uuid().parse(event_id);

    //Only allow the host to end the event.
    const session = await loadSession();
    await eventService.verifyAuthorship(event_id, session.user.id, trx);
    await eventService.verifyNotEnded(event_id, trx);

    const eventDataRecord = await eventService.repo.findById(event_id, trx);

    if (eventDataRecord.is_template) {
      //Delete the instance only.
      //await db(tablenames.event_instance).where({ id: eventRecord.id }).del();
    } else {
      //Delete the data, cascading to the instance.
      //await db(tablenames.event_data).where({ id: eventRecord.event_data_id }).del();
    }
    await eventService.endEvent(event_id, trx);
    await trx.commit();
    //global.io.to('user:' + session.user.id).emit('event_ended');
    global.io.to('event:' + event_id).emit('event:end', { eventId: event_id });
    return { success: true };
  } catch (err) {
    await trx.rollback();
    console.log(err.message);
    return {
      success: false,
      error: err.message,
    };
  }
}
