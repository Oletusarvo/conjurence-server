import { ExpressRequest, ExpressResponse } from '../express-server-types';
import { AuthenticatedUserRequest } from '../features/auth/types/authenticated-user';

/**
 * Creates a route-handler that wrapps the passed handler-function in a try-catch block, automatically returning a 500-response and logging errors on the console if they occur.
 * Otherwise the result of the handler is returned.
 * */
export function createHandler(
  handler: (
    req: AuthenticatedUserRequest | ExpressRequest,
    res: ExpressResponse
  ) => Promise<ExpressResponse>
) {
  return async (req: ExpressRequest | AuthenticatedUserRequest, res: ExpressResponse) => {
    try {
      return await handler(req, res);
    } catch (err: any) {
      console.log(err.message);
      return res.status(500).end('An unexpected error occured!');
    }
  };
}
