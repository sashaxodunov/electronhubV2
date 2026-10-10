
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { db } from '@/db'
import { datasheets } from '@/db/schema'
import { getStoredObject } from '@/lib/storage/s3'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteContext = {
	params: Promise<{ id: string }>
}

export async function GET(
	_request: Request,
	{ params }: RouteContext,
) {
	const { id } = await params

	if (!/^[1-9]\d*$/.test(id)) {
		return NextResponse.json(
			{ error: 'Документ не найден' },
			{ status: 404 },
		)
	}

	let item

	try {
		;[item] = await db
			.select({
				filePath: datasheets.filePath,
				fileName: datasheets.fileName,
				fileSize: datasheets.fileSize,
				isActive: datasheets.isActive,
			})
			.from(datasheets)
			.where(eq(datasheets.id, BigInt(id)))
			.limit(1)
	} catch {
		return NextResponse.json(
			{ error: 'Не удалось получить документ' },
			{ status: 500 },
		)
	}

	if (!item || !item.isActive) {
		return NextResponse.json(
			{ error: 'Документ не найден' },
			{ status: 404 },
		)
	}

	try {
		const object = await getStoredObject(item.filePath)

		if (!object.Body) {
			return NextResponse.json(
				{ error: 'Файл отсутствует в хранилище' },
				{ status: 404 },
			)
		}

		const safeFileName = (
			item.fileName ?? 'datasheet.pdf'
		)
			.replace(/[\\/\r\n"]/g, '_')
			.slice(0, 255)

		const headers = new Headers({
			'Content-Type': 'application/pdf',
			'Content-Disposition':
				`inline; filename = "${safeFileName}"`,
			'Cache-Control': 'private, no-cache',
			'X-Content-Type-Options': 'nosniff',
		})

		if (item.fileSize !== null) {
			headers.set('Content-Length', item.fileSize.toString())
		}

		return new Response(
			object.Body.transformToWebStream(),
			{ headers },
		)
	} catch {
		return NextResponse.json(
			{ error: 'Не удалось получить PDF из облачного хранилища' },
			{ status: 502 },
		)
	}
}
