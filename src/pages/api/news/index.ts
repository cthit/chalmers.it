import { createRouter } from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import NewsService from '@/services/newsService';

const router = createRouter<NextApiRequest, NextApiResponse>();

router
  .get(async (_, res) => {
    const news = await NewsService.getAll();
    res.status(200).json(news);
  });

export default router.handler();
