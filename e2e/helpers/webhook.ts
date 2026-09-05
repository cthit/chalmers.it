import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { slackErrors } from './slack';

export type WebhookRequest = {
  payload: unknown;
  errors: string[];
  status: number;
};
export type WebhookReceiver = Awaited<ReturnType<typeof startWebhookReceiver>>;

// Only the external Slack boundary is replaced. The website still serializes
// Markdown and sends a real HTTP webhook. Never needs real Slack credentials.
export async function startWebhookReceiver() {
  const requests: WebhookRequest[] = [];
  let rejectNext = false;
  const server = createServer(async (req, res) => {
    if (req.method !== 'POST' || req.url !== '/slack') {
      res.writeHead(404).end();
      return;
    }
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(Buffer.from(chunk));
      const payload: unknown = JSON.parse(Buffer.concat(chunks).toString());
      const errors = slackErrors(payload);
      const status = rejectNext || errors.length ? 400 : 200;
      rejectNext = false;
      requests.push({ payload, errors, status });
      res.writeHead(status).end(status === 200 ? 'ok' : 'invalid_blocks');
    } catch {
      res.writeHead(400).end('invalid_payload');
    }
  });
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  return {
    url: `http://127.0.0.1:${(server.address() as AddressInfo).port}/slack`,
    requests,
    rejectNext() {
      rejectNext = true;
    },
    reset() {
      requests.length = 0;
      rejectNext = false;
    },
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
        server.closeAllConnections();
      })
  };
}
