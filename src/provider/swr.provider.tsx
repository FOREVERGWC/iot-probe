'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { notFound, usePathname, useRouter } from 'next/navigation'
import { Middleware, SWRConfig, SWRHook } from 'swr'

// import routes from '@/routes'
import { api } from '@/utils/trpc'
import { TRPCClientError } from '@trpc/client'

export const SWRProvider = ({ children }: React.PropsWithChildren<{}>) => {
	const pathname = usePathname()
	const router = useRouter()
	const [client] = useState(() => api.createClient())

	return (
		<SWRConfig
			value={{
				onError: (error, key) => {
					if (error instanceof TRPCClientError) {
						console.error(error.message)
						switch (error.data) {
							case 'UNAUTHORIZED': {
								toast.error('请先登录')
								router.push(`/login?callback=${pathname}`)
								break
							}
							case 'BAD_REQUEST': {
								toast.error('请求错误')
								break
							}
							case 'NOT_FOUND': {
								toast.error('未找到')
								// Assuming that you are calling notFound on the root layout, it is not allowed to be used on the root layout.
								// See: https://github.com/vercel/next.js/discussions/54896
								router.push('/not-found' as any)
								break
							}
						}
					}
				}
			}}>
			{/*<SWRConfig value={{ use: [errorMiddleware] }}>*/}
			<api.Provider client={client}>{children}</api.Provider>
		</SWRConfig>
	)
}
