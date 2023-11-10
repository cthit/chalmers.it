import { createRouter } from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import NewsService from '@/services/newsService';

const router = createRouter<NextApiRequest, NextApiResponse>();

router
  .get((_, res) => {
    NewsService.post();
    res.status(200).end();
  });

export default router.handler();
