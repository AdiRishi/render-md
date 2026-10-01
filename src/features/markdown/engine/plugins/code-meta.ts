import { type Root as MdastRoot } from 'mdast'
import { visit } from 'unist-util-visit'

/**
 * remark: carry fenced-code meta strings (```ts title="a.ts") through to hast.
 */
export function remarkCodeMeta() {
  return (tree: MdastRoot) => {
    visit(tree, 'code', (node) => {
      if (!node.meta) return
      node.data ??= {}
      node.data.hProperties = { ...node.data.hProperties, dataMeta: node.meta }
    })
  }
}
