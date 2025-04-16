import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

const saveFile = async (blob: File) => {
	const dirName = '/uploads'
	const uploadDir = path.join(process.cwd(), 'public' + dirName)
	fs.mkdirSync(uploadDir, { recursive: true })
	const fileName = blob.name
	const buffer = await blob.arrayBuffer()
	fs.writeFileSync(uploadDir + '/' + fileName, new DataView(buffer))
	return '/uploads/' + fileName
}

export const POST = async (req: NextRequest) => {
	const data = await req.formData()
	const fileName = await saveFile(data.get('file') as File)
	return NextResponse.json({
		code: 200,
		msg: '上传成功！',
		data: fileName
	})
}
