import { DBContext } from '../../../db-context';
import { Service } from '../../../util/service';
import { tryCatch } from '../../../util/try-catch';
import { AuthError } from '../../auth/errors/auth';
import { verifyJWT } from '../../auth/util/verify-jwt';
import { EventError } from '../errors/events';
import { EventRepository } from '../repos/event-repository';

class EventService extends Service<EventRepository> {
  constructor(repo: EventRepository) {
    super(repo);
  }

  async verifyAuthorship(eventId: string, userId: string, ctx: DBContext) {
    const host = await this.repo.getHostByEventId(eventId, ctx);
    if (host && host.id !== userId) {
      throw new Error(AuthError.unauthorized);
    }
  }

  /**Verify the key held by the host of an anonymous event. */
  async verifyHostKey(event_id: string, hostKey: string) {
    const { value, error } = await tryCatch(() => verifyJWT(hostKey) as { eventId: string });
    if (error || value.eventId !== event_id) {
      throw new Error(AuthError.unauthorized);
    }
  }

  async verifyNotEnded(event_id: string, ctx: DBContext) {
    const e = await this.repo.findById(event_id, ctx);
    if (e.ended_at !== null) {
      throw new Error(EventError.ended);
    }
  }

  async endEvent(event_id: string, ctx: DBContext) {
    await this.repo.updateById(
      event_id,
      {
        ended_at: new Date(),
      },
      ctx
    );
  }
}

export const eventService = new EventService(new EventRepository());
