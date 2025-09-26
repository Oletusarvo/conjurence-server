import { DBContext } from '../../../db-context';
import { Service } from '../../../util/service';
import { AuthError } from '../../auth/errors/auth';
import { EventError } from '../errors/events';
import { EventRepository } from '../repos/event-repository';

class EventService extends Service<EventRepository> {
  constructor(repo: EventRepository) {
    super(repo);
  }

  async verifyAuthorship(event_id: string, user_id: string, ctx: DBContext) {
    const host = await this.repo.getHostByEventId(event_id, ctx);
    if (host.id !== user_id) {
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
