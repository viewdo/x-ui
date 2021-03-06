/* istanbul ignore file */
import { Remarkable } from 'remarkable'

export async function renderMarkdown(content: string): Promise<string | undefined> {
  const markdown = new Remarkable({
    html: true,
    typographer: true,
  })

  return markdown.render(content)
}
