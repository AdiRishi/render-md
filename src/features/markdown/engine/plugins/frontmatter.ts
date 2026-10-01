import { type Root as MdastRoot } from 'mdast'
import { type VFile } from 'vfile'
import { parse as parseYaml } from 'yaml'

import { type Frontmatter } from '../types'

/**
 * remark: extract YAML frontmatter into file.data and drop it from the tree.
 */
export function remarkExtractFrontmatter() {
  return (tree: MdastRoot, file: VFile) => {
    file.data.frontmatter = null
    const first = tree.children[0]
    if (first?.type !== 'yaml') return

    try {
      const parsed: unknown = parseYaml(first.value)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        // A JSON round-trip makes it plain data: YAML anchors can create cycles,
        // which would crash rendering and can't cross the worker boundary.
        file.data.frontmatter = JSON.parse(JSON.stringify(parsed)) as Frontmatter
      }
    } catch {
      // Malformed frontmatter is kept out of the document but otherwise ignored.
    }
    tree.children.shift()
  }
}
