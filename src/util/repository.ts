import { Knex } from 'knex';

export abstract class Repository {
  public static withSearch(
    query: Knex.QueryBuilder,
    search: string | null = null,
    columns: string[] = []
  ) {
    return query.where(function () {
      if (!search) return;
      const str = `%${search}%`;
      const [firstColumn, ...rest] = columns;
      this.whereILike(firstColumn, firstColumn);
      for (const column of rest) {
        this.orWhereILike(column, str);
      }
    });
  }
}
