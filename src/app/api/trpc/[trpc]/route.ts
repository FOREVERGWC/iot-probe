// import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
// import type { NextRequest } from 'next/server'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server'
import { createContext } from '@/server/context'

const handler = (req: Request) =>
	fetchRequestHandler({
		endpoint: '/api/trpc',
		req,
		router: appRouter,
		createContext
	})

export { handler as GET, handler as POST }

export const runtime = 'nodejs'
