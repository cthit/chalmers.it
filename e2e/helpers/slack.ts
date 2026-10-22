// Runtime contract for the Block Kit subset emitted by html-to-slack.
// Deliberately independent of the production converter/cleaner, so malformed
// nesting and missing fields cannot pass just because TypeScript accepts them.
// https://docs.slack.dev/reference/block-kit/blocks/rich-text-block/
// https://docs.slack.dev/reference/block-kit/blocks/header-block/
// https://docs.slack.dev/reference/block-kit/blocks/section-block/
type ObjectValue = Record<string, unknown>;

export function slackErrors(payload: unknown): string[] {
  const errors: string[] = [];

  const fail = (path: string, reason: string) =>
    errors.push(`${path}: ${reason}`);

  const object = (value: unknown, path: string): ObjectValue => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      fail(path, 'expected object');

      return {};
    }

    return value as ObjectValue;
  };

  const list = (value: unknown, path: string, max = Infinity): unknown[] => {
    if (!Array.isArray(value) || !value.length || value.length > max) {
      fail(path, `expected nonempty array with at most ${max} entries`);

      return [];
    }

    return value;
  };

  const text = (value: unknown, path: string, max = Infinity) => {
    if (typeof value !== 'string' || !value.length || [...value].length > max) {
      fail(path, `expected nonempty text with at most ${max} characters`);
    }
  };

  const url = (value: unknown, path: string) => {
    text(value, path, 3000);

    if (typeof value !== 'string' || !/^(https?:\/\/|mailto:)/.test(value)) {
      fail(path, 'expected absolute URL');
    }
  };

  const inline = (value: unknown, path: string) => {
    const item = object(value, path);

    switch (item.type) {
      case 'text':
        text(item.text, `${path}.text`);
        break;

      case 'link':
        url(item.url, `${path}.url`);

        if (item.text !== undefined) {
          text(item.text, `${path}.text`);
        }

        break;

      case 'emoji':
        text(item.name, `${path}.name`);
        break;

      default:
        fail(path, `invalid inline element type ${String(item.type)}`);
    }

    if (item.style !== undefined) {
      for (const [key, value] of Object.entries(
        object(item.style, `${path}.style`)
      )) {
        if (
          !['bold', 'italic', 'strike', 'code'].includes(key) ||
          typeof value !== 'boolean'
        ) {
          fail(`${path}.style.${key}`, 'invalid style');
        }
      }
    }
  };

  const richElement = (value: unknown, path: string) => {
    const item = object(value, path);
    const elements = list(item.elements, `${path}.elements`);

    switch (item.type) {
      case 'rich_text_section':
      case 'rich_text_quote':
      case 'rich_text_preformatted':
        elements.forEach((el, i) => inline(el, `${path}.elements[${i}]`));
        break;

      case 'rich_text_list':
        if (!['bullet', 'ordered'].includes(String(item.style))) {
          fail(path, 'invalid list style');
        }

        if (
          item.indent !== undefined &&
          (!Number.isInteger(item.indent) ||
            Number(item.indent) < 0 ||
            Number(item.indent) > 8)
        ) {
          fail(path, 'list indent must be an integer from 0 to 8');
        }

        elements.forEach((el, i) => {
          const elementPath = `${path}.elements[${i}]`;

          if (object(el, elementPath).type !== 'rich_text_section') {
            fail(elementPath, 'list requires sections');
          }

          richElement(el, elementPath);
        });
        break;

      default:
        fail(path, `invalid rich text element type ${String(item.type)}`);
    }
  };

  const blocks = (value: unknown, path: string) => {
    const items = list(value, path, 50);

    items.forEach((value, i) => {
      const blockPath = `${path}[${i}]`;
      const block = object(value, blockPath);

      switch (block.type) {
        case 'header': {
          const textObject = object(block.text, `${blockPath}.text`);

          if (textObject.type !== 'plain_text') {
            fail(blockPath, 'header requires plain_text');
          }

          text(textObject.text, `${blockPath}.text.text`, 150);
          break;
        }

        case 'section': {
          const textObject = object(block.text, `${blockPath}.text`);

          if (!['plain_text', 'mrkdwn'].includes(String(textObject.type))) {
            fail(blockPath, 'invalid text type');
          }

          text(textObject.text, `${blockPath}.text.text`, 3000);
          break;
        }

        case 'divider':
          break;

        case 'image':
          url(block.image_url, `${blockPath}.image_url`);
          text(block.alt_text, `${blockPath}.alt_text`, 2000);
          break;

        case 'rich_text':
          list(block.elements, `${blockPath}.elements`).forEach((el, j) =>
            richElement(el, `${blockPath}.elements[${j}]`)
          );
          break;

        default:
          fail(blockPath, `invalid block type ${String(block.type)}`);
      }
    });

    return items.length;
  };

  const message = object(payload, 'message');
  let count = blocks(message.blocks, 'blocks');

  list(message.attachments, 'attachments', 100).forEach((attachment, i) => {
    count += blocks(
      object(attachment, `attachments[${i}]`).blocks,
      `attachments[${i}].blocks`
    );
  });

  if (count > 50) {
    fail('message', 'more than 50 blocks');
  }

  return errors;
}

export function slackText(payload: unknown): string {
  if (Array.isArray(payload)) {
    return payload.map(slackText).join(' ');
  }

  if (!payload || typeof payload !== 'object') {
    return '';
  }

  return Object.entries(payload)
    .map(([key, value]) =>
      (key === 'text' || key === 'alt_text') && typeof value === 'string'
        ? value
        : slackText(value)
    )
    .join(' ');
}
