import db from './dbconfig';
import { tablenames } from './src/tablenames';
import { getRouter } from './src/util/get-router';

const router = getRouter();

router.get('/event-categories', async (req, res) => {
  try {
    const categories = await db(tablenames.event_category).pluck('label');
    return res.status(200).json(categories);
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).end();
  }
});

router.get('/event-sizes', async (req, res) => {
  try {
    const sizes = await db(tablenames.event_threshold).pluck('label');
    return res.status(200).json(sizes);
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).end();
  }
});

export { router as dataRouter };
