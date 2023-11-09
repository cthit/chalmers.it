import { createRouter } from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import NewsService from '@/services/newsService';

const router = createRouter<NextApiRequest, NextApiResponse>();

router
  .get((_, res) => {
    const news = NewsService.getAll();
    res.status(200).json(news);
  });

export default router.handler();
