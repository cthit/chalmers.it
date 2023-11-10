import { prisma } from '@/prisma';
import { Prisma } from '@prisma/client';

const webhooks = [
]

export default class NotifyService {

    static notifyNewsPost(post: Prisma.NewsPostGetPayload<{}>) {
        webhooks.forEach(webhook => {
            fetch(webhook, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "content": `Nyhet publicerad av **${post.writtenByCid}**`,
                    "embeds": [
                        {
                            "title": post.titleSv,
                            "url": `http://localhost:3000/post/${post.id}`,
                            "description": post.contentSv,
                            "color": 0x09cdda,
                            "image": {
                                "url": "https://chalmers.it/assets/logo-dark-txt-61b29abd5e9c8df2f6c500817b0dad65e86bd177cc29d88df9ee1507f9e8ebff.png"
                            }
                        }
                    ]
                })
            });
        });
    }

}
