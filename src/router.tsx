import { createRouter } from '@tanstack/react-router'

import { NotFound } from './components/site/NotFound'
import { routeTree } from './routeTree.gen'

export const getRouter = () =>
  createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: NotFound,
  })
