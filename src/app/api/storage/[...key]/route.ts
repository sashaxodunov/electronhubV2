import { NextResponse } from 'next/server'

import {
	fileExists,
	getFile
} from '@/lib/storage'

type RouteContext = {
	params: Promise<{
		key: string[]
	}>
}

function getMimeType(
	fileName: string
): string {
	const extension =
		fileName
			.split('.')
			.pop()
			?.toLowerCase()

	switch (extension) {
		case 'jpg':
		case 'jpeg':
			return 'image/jpeg'

		case 'png':
			return 'image/png'

		case 'webp':
			return 'image/webp'

		case 'gif':
			return 'image/gif'

		case 'svg':
			return 'image/svg+xml'

		case 'pdf':
			return 'application/pdf'

		default:
			return 'application/octet-stream'
	}
}

export async function GET(
	_request: Request,
	{ params }: RouteContext
) {
	const { key } = await params

	if (!key || key.length === 0) {
		return new NextResponse(
			'Файл не указан',
			{
				status: 400
			}
		)
	}

	const storageKey = key.join('/')

	try {
		const exists =
			await fileExists(storageKey)

		if (!exists) {
			return new NextResponse(
				'Файл не найден',
				{
					status: 404
				}
			)
		}

		const buffer =
			await getFile(storageKey)

		const fileName =
			key[key.length - 1] ?? ''

		const body =
			new Uint8Array(buffer)

		return new NextResponse(body, {
			status: 200,
			headers: {
				'Content-Type':
					getMimeType(fileName),

				'Content-Length':
					body.byteLength.toString(),

				'Cache-Control':
					'public, max-age=31536000, immutable'
			}
		})
	} catch {
		return new NextResponse(
			'Ошибка чтения файла',
			{
				status: 500
			}
		)
	}
}