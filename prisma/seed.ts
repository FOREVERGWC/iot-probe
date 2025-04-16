import prisma from '@/libs/db'

const main = async (): Promise<void> => {
	try {
		await prisma.role.createMany({
			data: [
				{ name: '管理员', sort: 1 },
				{ name: '用户', sort: 2 },
				{ name: '游客', sort: 3 },
				{ name: '测试', sort: 4 }
			]
		})

		await prisma.user.create({
			data: {
				username: '17606166931',
				password: 'a17606166931',
				phone: '17606166931',
				level: 10,
				user_role_links: {
					create: {
						role: {
							connect: {
								id: 1
							}
						}
					}
				}
			}
		})
	} catch (e) {
		console.error('插入错误！', e)
		process.exit(1)
	} finally {
		await prisma.$disconnect()
	}
}

main().then(() => {
	console.error('执行成功！')
})
