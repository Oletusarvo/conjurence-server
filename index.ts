import express from 'express';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { socketServer } from './socket-server';
import { authRouter } from './src/features/auth/routers/auth-router';
import { rootRouter } from './root-router';
import { eventRouter } from './src/features/events/routers/event-router';
import { dataRouter } from './data-router';
import { userRouter } from './src/features/users/routers/user-router';
const app = express();
const port = 3000;

app.use(express.static('node_modules'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      } else if (
        origin === 'http://10.215.98.92:5173' ||
        origin === 'http://localhost:5173' ||
        origin === 'https://localhost' ||
        origin === 'capacitor://localhost'
      ) {
        return callback(null, origin);
      } else {
        return callback(new Error(`Origin ${origin} blocked by CORS!`));
      }
    },
    methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use('/', rootRouter);
app.use('/api/auth', authRouter);
app.use('/api/events', eventRouter);
app.use('/api/data', dataRouter);
app.use('/api/users', userRouter);

//app.listen(port, () => console.log('Server listening on port', port));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      } else if (
        origin === 'http://10.215.98.92:5173' ||
        origin === 'http://localhost:5173' ||
        origin === 'https://localhost' ||
        origin === 'capacitor://localhost'
      ) {
        return callback(null, origin);
      } else {
        return callback(new Error(`Socket.io origin ${origin} blocked by CORS!`));
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    //credentials: true,
  },
});
global.io = io;
socketServer(io);

server.listen(port, () => {
  console.log('Server listening on port ', port);
});
