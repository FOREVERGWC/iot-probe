import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file = data.get('file');

    if (!file || !(file instanceof Blob)) {
        return NextResponse.json({ success: false, message: 'File not found or invalid format' });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 文件保存路径
    const path = `/Users/yao/Desktop/Projects/JS/iot-probe/${file.name}`;
    await writeFile(path, buffer);
    console.log(`open ${path} to see the uploaded file`);

    return NextResponse.json({ success: true });
}
