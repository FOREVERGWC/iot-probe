'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/utils/trpc'
import { useToast } from '@/components/ui/use-toast'
import { EnvelopeClosedIcon, LockClosedIcon, MobileIcon, PersonIcon } from '@radix-ui/react-icons'

export const registerSchema = z.object({
	username: z.string().min(1, { message: '用户名不能为空' }),
	password: z
		.string()
		.min(6, { message: '密码至少需要 6 个字符' })
		.max(80, { message: '密码至多需要 20 个字符' })
		.regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d\S]+$/, {
			message: '密码必须包含字母和数字'
		}),
	phone: z
		.string()
		.min(10, { message: '手机号至少需要 10 个字符' })
		.regex(/^(\+?\d{1,4}[\s-]?)?\(?\d{1,4}?\)?[\s-]?\d{1,4}[\s-]?\d{1,9}$/, {
			message: '无效的手机号格式'
		}),
	code: z.string().min(4, { message: '验证码至少需要 4 个字符' })
})

const RegisterForm = () => {
	const router = useRouter()
	const { trigger: registerTrigger } = api.register.useSWRMutation()
	const { trigger: sendVerificationTrigger } = api.sendVerificationCode.useSWRMutation()
	const { toast } = useToast()

	const form = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			username: '',
			password: '',
			phone: '',
			code: ''
		}
	})

	const handleRegister = async (values: z.infer<typeof registerSchema>) => {
		try {
			const result = await registerTrigger(values)
			if (result?.user) {
				toast({
					title: '注册成功',
					description: result.msg || '注册成功！',
					variant: 'default' // 可选：使用不同的颜色样式
				})
				router.push('/login')
			} else {
				toast({
					title: '注册失败',
					description: '注册失败，请重试。',
					variant: 'destructive'
				})
			}
		} catch (error: any) {
			toast({
				title: '注册失败',
				description: error?.message || '注册失败，请重试。',
				variant: 'destructive'
			})
		}
	}

	const handleSendCode = async () => {
		const phoneValue = form.getValues('phone')
		if (!phoneValue) {
			toast({
				title: '发送失败',
				description: '请先输入有效的手机号。',
				variant: 'destructive'
			})
			return
		}
		const result = await sendVerificationTrigger({ phone: phoneValue })
		toast({
			title: '验证码已发送',
			description: '验证码已发送到您的手机，请注意查收。',
			variant: 'default'
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="relative">
									<PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
									<Input type="text" placeholder="用户名" {...field} className="pl-10" />
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="relative">
									<LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
									<Input type="password" placeholder="密码" {...field} className="pl-10" />
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="phone"
					render={({ field }) => (
						<FormItem>
							<div className="flex space-x-2">
								<FormControl>
									<div className="relative">
										<MobileIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
										<Input type="text" placeholder="手机号" {...field} className="pl-10" />
									</div>
								</FormControl>
								<Button type="button" onClick={handleSendCode}>
									发送验证码
								</Button>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="code"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="relative">
									<EnvelopeClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
									<Input type="text" placeholder="验证码" {...field} className="pl-10" />
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className="w-full" type="submit">
					注册
				</Button>
			</form>
		</Form>
	)
}

export default RegisterForm
