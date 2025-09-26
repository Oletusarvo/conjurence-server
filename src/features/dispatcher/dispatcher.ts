type TMessage = { to?: string } & (
  | {
      message: 'event:interest';
      payload: {
        username: string;
        eventId: string;
        currentInterestCount: number;
        newAttendanceRecord: any;
      };
    }
  | {
      message: 'event:attendance_update';
      payload: {
        username: string;
        eventId: string;
        updatedAttendanceRecord: any;
      };
    }
  | {
      message: 'event:update';
      payload: {
        eventId: string;
      };
    }
  | {
      message: 'event:new';
      payload: null;
    }
);

class Dispatcher {
  dispatch(msg: TMessage) {
    const { to, payload, message } = msg;
    if (to) {
      global.io.to(to).emit(message, payload);
    } else {
      global.io.emit(message, payload);
    }
  }
}

export const dispatcher = new Dispatcher();
