import { Service } from '../../../util/service';
import { AttendanceRepository } from '../repos/attendance-repository';

class AttendanceService extends Service<AttendanceRepository> {
  constructor(repo: AttendanceRepository) {
    super(repo);
  }
}

export const attendanceService = new AttendanceService(new AttendanceRepository());
