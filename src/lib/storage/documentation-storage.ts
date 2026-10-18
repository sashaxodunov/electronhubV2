import 'server-only'

import {
	DeleteObjectCommand,
	GetObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3'

let client: S3Client | null = null

export interface DocumentationFileInfo {
	size: number
	contentType: string
	lastModified: Date | null
}

function getConfig() {
	const endpoint = process.env.DOCUMENTATION_S3_ENDPOINT
	const region = process.env.DOCUMENTATION_S3_REGION
	const bucket = process.env.DOCUMENTATION_S3_BUCKET
	const accessKeyId = process.env.DOCUMENTATION_S3_ACCESS_KEY_ID
	const secretAccessKey = process.env.DOCUMENTATION_S3_SECRET_ACCESS_KEY

	if (
		!endpoint ||
		!region ||
		!bucket ||
		!accessKeyId ||
		!secretAccessKey
	) {
		throw new Error(
			'Не настроено S3-хранилище документации. Проверь переменные DOCUMENTATION_S3_*.',
		)
	}

	return {
		endpoint,
		region,
		bucket,
		accessKeyId,
		secretAccessKey,
	}
}

function getClient(): S3Client {
	if (client) return client

	const config = getConfig()

	client = new S3Client({
		endpoint: config.endpoint,
		region: config.region,
		forcePathStyle: true,
		credentials: {
			accessKeyId: config.accessKeyId,
			secretAccessKey: config.secretAccessKey,
		},
	})

	return client
}

function getBucket(): string {
	return getConfig().bucket
}

/**
 * Проверяет ключ объекта и защищает от выхода за пределы хранилища.
 * Ключ не должен содержать пустые сегменты, "." или "..".
 */
function validateKey(key: string): string {
	const normalized = key.replace(/\\/g, '/').replace(/^\/+/, '')

	if (
		!normalized ||
		normalized.includes('\0') ||
		normalized.split('/').some(
			(segment) =>
				!segment || segment === '.' || segment === '..',
		)
	) {
		throw new Error('Некорректный ключ файла документации.')
	}

	return normalized
}

export async function saveDocumentationFile(
	key: string,
	body: Buffer | Uint8Array,
	contentType = 'application/octet-stream',
): Promise<void> {
	const normalizedKey = validateKey(key)

	await getClient().send(
		new PutObjectCommand({
			Bucket: getBucket(),
			Key: normalizedKey,
			Body: body,
			ContentType: contentType,
		}),
	)
}

export async function getDocumentationFile(
	key: string,
): Promise<Buffer> {
	const normalizedKey = validateKey(key)

	const result = await getClient().send(
		new GetObjectCommand({
			Bucket: getBucket(),
			Key: normalizedKey,
		}),
	)

	if (!result.Body) {
		throw new Error('Файл документации не найден.')
	}

	const bytes = await result.Body.transformToByteArray()

	return Buffer.from(bytes)
}

export async function documentationFileExists(
	key: string,
): Promise<boolean> {
	const normalizedKey = validateKey(key)

	try {
		await getClient().send(
			new HeadObjectCommand({
				Bucket: getBucket(),
				Key: normalizedKey,
			}),
		)

		return true
	} catch (error) {
		const result = error as {
			name?: string
			$metadata?: { httpStatusCode?: number }
		}

		if (
			result.name === 'NotFound' ||
			result.name === 'NoSuchKey' ||
			result.$metadata?.httpStatusCode === 404
		) {
			return false
		}

		throw error
	}
}

export async function getDocumentationFileInfo(
	key: string,
): Promise<DocumentationFileInfo | null> {
	const normalizedKey = validateKey(key)

	try {
		const result = await getClient().send(
			new HeadObjectCommand({
				Bucket: getBucket(),
				Key: normalizedKey,
			}),
		)

		return {
			size: result.ContentLength ?? 0,
			contentType:
				result.ContentType ?? 'application/octet-stream',
			lastModified: result.LastModified ?? null,
		}
	} catch (error) {
		const result = error as {
			name?: string
			$metadata?: { httpStatusCode?: number }
		}

		if (
			result.name === 'NotFound' ||
			result.name === 'NoSuchKey' ||
			result.$metadata?.httpStatusCode === 404
		) {
			return null
		}

		throw error
	}
}

export async function deleteDocumentationFile(
	key: string,
): Promise<void> {
	const normalizedKey = validateKey(key)

	await getClient().send(
		new DeleteObjectCommand({
			Bucket: getBucket(),
			Key: normalizedKey,
		}),
	)
}