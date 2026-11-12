export const markdownCases = [
  {
    name: 'inline styles and paragraphs',
    markdown: `A **bold announcement** with *italic words*, ~~old text~~ and \`inline code\`.

Second paragraph.`,
    expected: [
      'bold announcement',
      'italic words',
      'inline code',
      'Second paragraph'
    ]
  },
  {
    name: 'nested lists and blockquotes',
    markdown: `- First item
  - Nested item

1. Ordered item
2. Next item

> Quoted **committee message**
>
> Another quoted paragraph.`,
    expected: [
      'First item',
      'Nested item',
      'Ordered item',
      'committee message',
      'Another quoted paragraph'
    ]
  },
  {
    name: 'headings and fenced code',
    markdown: `# Release notes

\`\`\`js
const ready = true;
console.log(ready);
\`\`\`

---

All done.`,
    expected: ['Release notes', 'const ready = true;', 'All done']
  },
  {
    name: 'relative links and images',
    markdown: `[Committee page](/groups/digit)

![Committee logo](/itlogo.svg)`,
    expected: ['Committee page', 'Committee logo'],
    expectedPaths: ['/groups/digit', '/itlogo.svg']
  },
  {
    name: 'blank lines and Swedish characters',
    // Keep the two spaces that create a Markdown hard line break explicit.
    markdown: `

Räksmörgås & välkommen 🎉


En rad.${'  '}
Nästa rad.

`,
    expected: ['Räksmörgås & välkommen 🎉', 'Nästa rad.']
  }
];
