import { Remarkable } from 'remarkable'
const markdown = new Remarkable({
  html: true,
  typographer: true,
})

export async function render(content: string): Promise<string | undefined> {
  return markdown.render(content)
}
