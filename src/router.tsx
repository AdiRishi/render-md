import { createRouter } from '@tanstack/react-router'

import { NotFound } from '@/features/site/NotFound'

import { routeTree } from './routeTree.gen'

export const getRouter = () =>
  createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: NotFound,
  })
