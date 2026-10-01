import { type ElementProps, sourceLineOf } from './element-props'

/** Tables scroll horizontally inside their own frame. */
export function Table({ node: _node, ...props }: ElementProps<'table'>) {
  return (
    <div className="table-scroll" data-line={sourceLineOf(props)}>
      <table {...props} />
    </div>
  )
}
