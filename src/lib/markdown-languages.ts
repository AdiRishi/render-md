import { LanguageDescription } from '@codemirror/language'
import { languages } from '@codemirror/language-data'
import { graphqlLanguageSupport } from 'cm6-graphql'

const graphqlLanguage = LanguageDescription.of({
  name: 'GraphQL',
  alias: ['graphql', 'gql'],
  extensions: ['graphql', 'gql'],
  support: graphqlLanguageSupport(),
})

export const markdownCodeLanguages = [...languages, graphqlLanguage]
