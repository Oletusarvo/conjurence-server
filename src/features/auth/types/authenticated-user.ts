import { Request } from 'express';
import { ExpressRequest } from '../../../express-server-types';
import { TUser } from './user';

export interface AuthenticatedUserRequest extends ExpressRequest {
  session?: {
    user: TUser;
    expires: number;
  };
}
