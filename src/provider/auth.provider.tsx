'use client'

import React, { createContext, useReducer, useContext, useEffect, ReactNode, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AuthState {
	id: number | null
	username: string | null
	roleIdList: Array<number>
	token: string | null
}

type AuthAction =
	| { type: 'LOGIN'; payload: { id: number; username: string; roleIdList: Array<number>; token: string } }
	| { type: 'LOGOUT' }

const initialAuthState: AuthState = {
	id: null,
	username: null,
	roleIdList: [],
	token: null
}

const AuthContext = createContext<{
	state: AuthState
	dispatch: React.Dispatch<AuthAction>
}>({
	state: initialAuthState,
	dispatch: () => null
})

function authReducer(state: AuthState, action: AuthAction): AuthState {
	switch (action.type) {
		case 'LOGIN':
			return {
				...state,
				id: action.payload.id,
				username: action.payload.username,
				roleIdList: action.payload.roleIdList,
				token: action.payload.token
			}
		case 'LOGOUT':
			return {
				...state,
				id: null,
				username: null,
				roleIdList: [],
				token: null
			}
		default:
			return state
	}
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(authReducer, initialAuthState)
	const router = useRouter()
	const pathname = usePathname()

	const [isAuthInitialized, setAuthInitialized] = useState(false)

	useEffect(() => {
		const savedToken = localStorage.getItem('token')
		const savedId = localStorage.getItem('id')
		const savedUsername = localStorage.getItem('username')
		const savedRoleIdList = localStorage.getItem('roleIdList') || '[]'

		if (savedToken && savedId && savedUsername) {
			dispatch({
				type: 'LOGIN',
				payload: {
					id: parseInt(savedId),
					username: savedUsername,
					roleIdList: JSON.parse(savedRoleIdList),
					token: savedToken
				}
			})
		}
		setAuthInitialized(true)
	}, [])

	useEffect(() => {
		if (state.token) {
			localStorage.setItem('token', state.token)
			localStorage.setItem('id', state.id!.toString())
			localStorage.setItem('username', state.username!)
			localStorage.setItem('roleIdList', JSON.stringify(state.roleIdList))
		} else {
			localStorage.removeItem('token')
			localStorage.removeItem('id')
			localStorage.removeItem('username')
			localStorage.removeItem('roleIdList')
		}
	}, [state.token, state.id, state.username, state.roleIdList])

	useEffect(() => {
		if (!isAuthInitialized) return // 确保状态已初始化再执行路由逻辑

		const isLoggedIn = state.token !== null

		if (!isLoggedIn && pathname !== '/login' && pathname !== '/register' && pathname !== '/forgot-password') {
			router.push('/login')
		} else if (isLoggedIn && (pathname === '/login' || pathname === '/register')) {
			router.push('/')
		}
	}, [router, pathname, state.token, isAuthInitialized])

	return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>
}

export function useAuth() {
	return useContext(AuthContext)
}
