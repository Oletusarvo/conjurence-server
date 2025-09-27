import { getRouter } from './src/util/get-router';

const router = getRouter();
router.get('/', async (req, res) => res.status(200).send('Hello from root!'));
//router.get('/tos', async (req, res) => res.status(200).sendFile(__dirname + 'public/terms.pdf'));
export { router as rootRouter };
