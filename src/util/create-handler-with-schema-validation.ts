import z, { ZodType } from 'zod';
import { ExpressRequest, ExpressResponse } from '../express-server-types';
import { AuthenticatedUserRequest } from '../features/auth/types/authenticated-user';
import { createHandler } from './create-handler';

/**Adds a zod-schema validation step before calling the handler, which returns status 400 on failure, with the error. Passes the parsed data as the last argument for the handler.
 * @todo
 */
export function createHandlerWithSchemaValidation(
  schema: ZodType<any>,
  handler: (
    req: ExpressRequest | AuthenticatedUserRequest,
    res: ExpressResponse,
    data: any
  ) => Promise<ExpressResponse>
) {
  return createHandler(async (req, res) => {
    if (!req.body) {
      return res.status(400).send('The request is missing a body!');
    }

    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(z.treeifyError(parseResult.error));
    }

    return await handler(req, res, parseResult.data);
  });
}
