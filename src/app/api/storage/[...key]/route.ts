import { NextResponse } from 'next/server'
import {
	documentationFileExists,
	getDocumentationFile,
	fileExists,
	getFile,
	getSchematicFile,
	schematicFileExists,
} from '@/lib/storage'

type RouteContext = {
	params: Promise<{ key: string[] }>
}

function getMimeType(fileName: string): string {
	const extension = fileName.split('.').pop()?.toLowerCase()

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

function validateKey(key: string[]): boolean {
	return (
		key.length > 0 &&
		key.every(
			(segment) =>
				segment.length > 0 &&
				segment !== '.' &&
				segment !== '..' &&
				!segment.includes('\0') &&
				!segment.includes('/') &&
				!segment.includes('\\'),
		)
	)
}

export async function GET(
	_request: Request,
	{ params }: RouteContext,
) {
	const { key } = await params

	if (!validateKey(key)) {
		return new NextResponse('Некорректный ключ файла', {
			status: 400,
		})
	}

	const namespace = key[0]

	// Для documentation префикс — это часть URL,
	// а не часть ключа объекта внутри S3.
	const isDocumentation = namespace === 'documentation'
	const isSchematic = namespace === 'schematics'

	const objectKey = isDocumentation
		? key.slice(1).join('/')
		: key.join('/')

	if (!objectKey) {
		return new NextResponse('Файл не указан', {
			status: 400,
		})
	}

	// Дополнительная проверка после удаления URL-префикса.
	if (!validateKey(objectKey.split('/'))) {
		return new NextResponse('Некорректный ключ файла', {
			status: 400,
		})
	}

	const fileName = key[key.length - 1] ?? ''

	try {
		let exists: boolean

		if (isDocumentation) {
			exists = await documentationFileExists(objectKey)
		} else if (isSchematic) {
			// Модуль схем сам проверяет префикс schematics/.
			exists = await schematicFileExists(objectKey)
		} else {
			exists = await fileExists(objectKey)
		}

		if (!exists) {
			return new NextResponse('Файл не найден', {
				status: 404,
			})
		}

		let buffer: Buffer

		if (isDocumentation) {
			buffer = await getDocumentationFile(objectKey)
		} else if (isSchematic) {
			buffer = await getSchematicFile(objectKey)
		} else {
			buffer = await getFile(objectKey)
		}

		const body = new Uint8Array(buffer)

		return new NextResponse(body, {
			status: 200,
			headers: {
				'Content-Type': getMimeType(fileName),
				'Content-Length': body.byteLength.toString(),
				'Cache-Control': 'public, max-age=31536000, immutable',
				'X-Content-Type-Options': 'nosniff',
			},
		})
	} catch (error) {
		console.error('[storage] Ошибка чтения файла', {
			namespace,
			fileName,
			error,
		})

		return new NextResponse('Ошибка чтения файла', {
			status: 500,
		})
	}
}