import { type Components } from 'hast-util-to-jsx-runtime'

import { Alert } from './Alert'
import { CodeFence } from './CodeFence'
import { createHeading } from './Heading'
import { Image } from './Image'
import { Link } from './Link'
import { Table } from './Table'
import { ListItem, TaskCheckbox } from './TaskList'

/** Which React component renders each HTML element of a document. */
export const elementComponents: Partial<Components> = {
  a: Link,
  h1: createHeading('h1'),
  h2: createHeading('h2'),
  h3: createHeading('h3'),
  h4: createHeading('h4'),
  h5: createHeading('h5'),
  h6: createHeading('h6'),
  pre: CodeFence,
  table: Table,
  li: ListItem,
  input: TaskCheckbox,
  div: Alert,
  img: Image,
}
