import { DocumentView } from '@/features/markdown/render/DocumentView'
import { Specimen } from '@/features/markdown/specimen/Specimen'

import { type GuideBlock as Block } from '../content'
import { type GuideData } from '../data'
import { toMarkdown } from '../table/table-model'
import { TableGenerator } from '../table/TableGenerator'
import { Gallery } from './Gallery'
import { PdfSettings } from './PdfSettings'
import { Steps } from './Steps'

/** One block of a guide, drawn from its content and the server-rendered markdown. */
export function GuideBlock({ block, data }: { block: Block; data: GuideData }) {
  switch (block.kind) {
    case 'prose':
      return <DocumentView hast={data.rendered[block.markdown]} className="max-w-[44rem]" />
    case 'specimens':
      return (
        <div className="flex flex-col gap-9">
          {block.entries.map((entry) => (
            <Specimen
              key={entry.source}
              entry={entry}
              hast={data.rendered[entry.source]}
              origin="guide"
              result={
                block.shows === 'html'
                  ? { shows: 'html', markup: data.markup[entry.source] }
                  : { shows: 'page' }
              }
            />
          ))}
        </div>
      )
    case 'gallery':
      return <Gallery items={block.items} rendered={data.rendered} />
    case 'steps':
      return <Steps steps={block.steps} rendered={data.rendered} />
    case 'pdf-settings':
      return <PdfSettings />
    case 'table-generator':
      return (
        <TableGenerator
          initial={block.initial}
          rendered={data.rendered[toMarkdown(block.initial)]}
        />
      )
    default: {
      const unknown: never = block
      return unknown
    }
  }
}
