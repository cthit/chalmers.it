import type htmlToSlack from 'html-to-slack';

type ConvertedBlocks = ReturnType<typeof htmlToSlack>;
type Element = {
  type?: string;
  text?: string;
  elements?: Element[];
  [key: string]: unknown;
};

export function slackHeaderText(text: string) {
  const characters = Array.from(text);
  return characters.length > 150
    ? characters.slice(0, 149).join('') + '…'
    : text;
}

// html-to-slack can return section wrappers inside quotes, even though Slack
// requires inline elements there. Normalize runtime output before sending it.
function inlineElements(elements: Element[]): Element[] {
  return elements.flatMap((element) => {
    if (!element.type) return [];
    if (element.elements) {
      const children = inlineElements(element.elements);
      return children.length ? [...children, { type: 'text', text: '\n' }] : [];
    }
    if (element.type === 'text') {
      return element.text
        ? [{ ...element, text: element.text.trim() ? element.text : '\n' }]
        : [];
    }
    return [element];
  });
}

export function cleanSlackBlocks(blocks: ConvertedBlocks): ConvertedBlocks {
  return blocks.flatMap<ConvertedBlocks[number]>((block) => {
    if (!block.type) return [];
    if (block.type === 'header') {
      return block.text.text.trim()
        ? [
            {
              ...block,
              text: { ...block.text, text: slackHeaderText(block.text.text) }
            }
          ]
        : [];
    }
    if (block.type !== 'rich_text') return [block];
    function clean(element: Element): Element[] {
      if (!element.type || !element.elements) return [];
      const elements =
        element.type === 'rich_text_list'
          ? element.elements.flatMap(clean)
          : inlineElements(element.elements);
      return elements.length ? [{ ...element, elements }] : [];
    }
    const elements = (block.elements as unknown as Element[]).flatMap(clean);
    return elements.length ? [{ ...block, elements } as typeof block] : [];
  }) as ConvertedBlocks;
}
