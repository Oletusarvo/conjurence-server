/**@jest-environment node */

import db from '@/dbconfig';
import { TestEventRepository } from '../event-repository';
import { tablenames } from '@/tablenames';

describe('Testing the event repository getBaseQuery-method', () => {
  beforeAll(async () => {
    //Add event data

    //Add event instance
    await db.transaction(async trx => {
      const testUserRecord = await trx(tablenames.user)
        .where({ email: 'test@email.com' })
        .select('id')
        .first();

      const [newDataRecord] = await trx(tablenames.event_data).insert(
        {
          author_id: testUserRecord.id,
          title: 'test',
          description: 'event for testing',
          spots_available: 5,
        },
        ['id']
      );

      const [newInstanceRecord] = await trx(tablenames.event_instance).insert(
        {
          event_data_id: newDataRecord.id,

          event_threshold_id: db
            .select('id')
            .from(tablenames.event_threshold)
            .where({ label: 'small' })
            .limit(1),
        },
        ['id']
      );

      await trx(tablenames.event_attendance).insert({
        user_id: testUserRecord.id,
        //Assign any event instance id preset.
        event_instance_id: newInstanceRecord.id,
        attendance_status_id: db
          .select('id')
          .from(tablenames.event_attendance_status)
          .where({ label: 'host' })
          .limit(1),
      });
    });
  });

  afterAll(async () => {
    await db(tablenames.event_data).del();
    await db.destroy();
  });

  it('Returns the correct columns', async () => {
    const repo = new TestEventRepository();
    const res = await repo.getBaseQuery(db);
    expect(Object.keys(res)).toEqual(
      expect.arrayContaining([
        'id',
        'ended_at',
        'title',
        'description',
        'category',
        'created_at',
        'spots_available',
        'host',
        'position',
        'position_metadata',
        'auto_join_threshold',
        'auto_leave_threshold',
        'location_title',
        'is_mobile',
        'interested_count',
        'attendance_count',
      ])
    );
  });
});
