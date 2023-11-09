import { createRouter } from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import EventService from '@/services/eventService';

const router = createRouter<NextApiRequest, NextApiResponse>();

router
  .get((_, res) => {
    const news = EventService.getAll();
    res.status(200).json(news);
  });

export default router.handler();
