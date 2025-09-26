'use server';

import db from '@/dbconfig';
import { parseFormDataUsingSchema } from '@/util/parse-form-data-using-schema';
import { getParseResultErrorMessage } from '@/util/get-parse-result-error-message';
import { TEventError } from '@/features/events/errors/events';
import { createGeographyRow } from '@/features/geolocation/util/create-geography-row';
import { eventService } from '../services/event-service';
import { TEvent, updateEventSchema } from '../schemas/event-schema';
import { dispatcher } from '@/features/dispatcher/dispatcher';

export async function updateEventAction(
  payload: FormData
): Promise<ActionResponse<TEvent, TEventError>> {
  const parsedInstanceResult = parseFormDataUsingSchema(payload, updateEventSchema);
  if (!parsedInstanceResult.success) {
    return { success: false, error: getParseResultErrorMessage<TEventError>(parsedInstanceResult) };
  }

  const trx = await db.transaction();
  try {
    const data = parsedInstanceResult.data;
    const newEventRecord = await eventService.repo.updateById(data.id, data, trx);
    await trx.commit();
    dispatcher.dispatch({
      to: `event:${data.id}`,
      message: 'event:update',
      payload: { eventId: data.id },
    });
    return { success: true, data: newEventRecord };
  } catch (err) {
    await trx.rollback();
    console.log(err.message);
    return { success: false };
  }
}
