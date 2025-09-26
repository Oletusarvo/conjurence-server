import { DBContext } from '../../../db-context';
import { tablenames } from '../../../tablenames';
import { Repository } from '../../../util/repository';
import { EventMetaRepository } from './event-meta-repository';

export class EventTemplateRepository extends EventMetaRepository {
  protected getBaseQuery(ctx: DBContext) {
    return ctx({ template: tablenames.event_template })
      .join(
        this.getCategorySubquery(ctx),
        'category.category_id_actual',
        'template.event_category_id'
      )
      .join(
        this.getSizeSubQuery(ctx),
        'event_threshold.threshold_id',
        'template.event_threshold_id'
      )
      .select(
        'template.id as id',
        'title',
        'description',
        'event_threshold.size',
        'category.category',
        'author_id'
      );
  }

  /**Returns event-templates a user has created. */
  async findTemplatesByAuthorId(author_id: string, search: string | null, ctx: DBContext) {
    const query = this.getBaseQuery(ctx).where({ author_id });
    return await Repository.withSearch(query, search, ['title', 'description']);
  }

  async findTemplateById(id: string, ctx: DBContext) {
    return this.getBaseQuery(ctx).where({ id }).first();
  }

  async create(data: any, ctx: DBContext) {
    await ctx(tablenames.event_template).insert({
      author_id: data.author_id,
      title: data.title,
      description: data.description,
      event_threshold_id: ctx
        .select('id')
        .from(tablenames.event_threshold)
        .where({ label: data.size })
        .limit(1),
      event_category_id: ctx
        .select('id')
        .from(tablenames.event_category)
        .where({ label: data.category })
        .limit(1),
    });
  }
}
