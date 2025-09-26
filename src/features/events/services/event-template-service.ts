import { DBContext } from '../../../db-context';
import { tablenames } from '../../../tablenames';
import { Service } from '../../../util/service';
import { EventTemplateRepository } from '../repos/event-template-repository';

export class EventTemplateService extends Service<EventTemplateRepository> {
  constructor(repo) {
    super(repo);
  }

  async findTemplateById(templateId: string, session: any, ctx: DBContext) {
    const [author_id] = await ctx(tablenames.event_template)
      .where({ id: templateId })
      .pluck('author_id');
    if (author_id !== session.user.id) {
      throw new Error('Only the author of a template can use it!');
    }
    return await this.repo.findTemplateById(templateId, ctx);
  }
}

export const eventTemplateService = new EventTemplateService(new EventTemplateRepository());
