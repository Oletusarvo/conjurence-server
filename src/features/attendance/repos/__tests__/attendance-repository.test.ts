/**
 * @jest-environment node
 */
import { TestAttendanceRepository } from '../attendance-repository';
import db from '@/dbconfig';
import { tablenames } from '@/tablenames';

describe('Testing the attendance repository getBaseQuery', () => {
  beforeAll(async () => {
    //Insert test data.
    //Create event data.
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
          .where({ label: 'interested' })
          .limit(1),
      });
    });
  });

  afterAll(async () => {
    //Delete test data. Cascades to instance and attendance.
    await db(tablenames.event_data).del();
    await db.destroy();
  });

  test('Returns the correct columns', async () => {
    const repo = new TestAttendanceRepository();
    const res = await repo.getBaseQuery(db).first();
    expect(Object.keys(res)).toEqual(
      expect.arrayContaining([
        'username',
        'status',
        'event_instance_id',
        'requested_at',
        'updated_at',
      ])
    );
  });
});
