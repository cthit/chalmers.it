import { Prisma } from '@prisma/client';

interface Notifier {
  notifyNewsPost(post: Prisma.NewsPostGetPayload<{}>): void;
}

export default class NotifyService {
  static notifyNewsPost(post: Prisma.NewsPostGetPayload<{}>) {
    notifiers.forEach((notifier) => {
      notifier.notifyNewsPost(post);
    });
  }
}

class DiscordWebhookNotifier implements Notifier {
  private webhook: string;

  public constructor(webhook: string) {
    this.webhook = webhook;
  }

  notifyNewsPost(post: Prisma.NewsPostGetPayload<{}>) {
    fetch(this.webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: `Nyhet publicerad av **${post.writtenByCid}**`,
        embeds: [
          {
            title: post.titleSv,
            url: `http://${process.env.BASE_URL || 'localhost:3000'}/post/${
              post.id
            }`,
            description: post.contentSv,
            color: 0x00a8d3,
            image: {
              url: 'https://chalmers.it/assets/logo-dark-txt-61b29abd5e9c8df2f6c500817b0dad65e86bd177cc29d88df9ee1507f9e8ebff.png'
            }
          }
        ]
      })
    });
  }
}

class SlackWebhookNotifier implements Notifier {
  private webhook: string;

  public constructor(webhook: string) {
    this.webhook = webhook;
  }

  notifyNewsPost(post: Prisma.NewsPostGetPayload<{}>) {
    fetch(this.webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Nyhet publicerad av *${post.writtenByCid}*`
            }
          }
        ],
        attachments: [
          {
            color: '#00a8d3',
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*<http://${
                    process.env.BASE_URL || 'localhost:3000'
                  }/post/${post.id}|${post.titleSv}>*`
                }
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `${post.contentSv}`
                }
              },
              {
                type: 'image',
                image_url:
                  'https://chalmers.it/assets/logo-dark-txt-61b29abd5e9c8df2f6c500817b0dad65e86bd177cc29d88df9ee1507f9e8ebff.png',
                alt_text: 'inspiration'
              }
            ]
          }
        ]
      })
    });
  }
}

const notifiers: Notifier[] = [
];
