
import 'server-only'

import {
	DeleteObjectCommand,
	GetObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3'

const endpoint = process.env.SCHEMATICS_S3_ENDPOINT
const region = process.env.SCHEMATICS_S3_REGION
const bucket = process.env.SCHEMATICS_S3_BUCKET
const accessKeyId = process.env.SCHEMATICS_S3_ACCESS_KEY_ID
const secretAccessKey = process.env.SCHEMATICS_S3_SECRET_ACCESS_KEY

function getConfig() {
	if (
		!endpoint ||
		!region ||
		!bucket ||
		!accessKeyId ||
		!secretAccessKey
	) {
		throw new Error(
			'Не настроено S3-хранилище принципиальных схем. Проверь переменные SCHEMATICS_S3_*.',
		)
	}

	return {
		endpoint,
		region,
		bucket,
		credentials: {
			accessKeyId,
			secretAccessKey,
		},
	}
}

let client: S3Client | null = null

function getClient(): S3Client {
	if (!client) {
		const config = getConfig()

		client = new S3Client({
			region: config.region,
			endpoint: config.endpoint,
			credentials: config.credentials,
			forcePathStyle: true,
		})
	}

	return client
}

function validateKey(key: string): string {
	const normalized = key.replace(/\\/g, '/').replace(/^\/+/, '')

	if (
		!normalized ||
		normalized.includes('\0') ||
		normalized.split('/').some(
			(part) => !part || part === '.' || part === '..',
		)
	) {
		throw new Error('Недопустимый ключ файла схемы')
	}

	if (!normalized.startsWith('schematics/')) {
		throw new Error(
			'Файлы схем должны находиться в каталоге schematics/',
		)
	}

	return normalized
}

function getContentType(key: string): string {
	const extension = key.split('.').pop()?.toLowerCase()

	switch (extension) {
		case 'json':
			return 'application/json; charset=utf-8'
		case 'svg':
			return 'image/svg+xml'
		case 'png':
			return 'image/png'
		case 'webp':
			return 'image/webp'
		case 'pdf':
			return 'application/pdf'
		default:
			return 'application/octet-stream'
	}
}

/**
 * Сохраняет файл в отдельный бакет принципиальных схем.
 * Вызывать только на сервере после проверки прав доступа.
 */
export async function saveSchematicFile(
	storageKey: string,
	data: Buffer | Uint8Array,
): Promise<void> {
	const key = validateKey(storageKey)
	const config = getConfig()

	await getClient().send(
		new PutObjectCommand({
			Bucket: config.bucket,
			Key: key,
			Body: data,
			ContentType: getContentType(key),
		}),
	)
}

/**
 * Возвращает содержимое файла схемы.
 */
export async function getSchematicFile(
	storageKey: string,
): Promise<Buffer> {
	const key = validateKey(storageKey)
	const config = getConfig()

	const result = await getClient().send(
		new GetObjectCommand({
			Bucket: config.bucket,
			Key: key,
		}),
	)

	if (!result.Body) {
		throw new Error('Файл схемы не найден в S3')
	}

	return Buffer.from(await result.Body.transformToByteArray())
}

/**
 * Проверяет существование файла схемы.
 */
export async function schematicFileExists(
	storageKey: string,
): Promise<boolean> {
	const key = validateKey(storageKey)
	const config = getConfig()

	try {
		await getClient().send(
			new HeadObjectCommand({
				Bucket: config.bucket,
				Key: key,
			}),
		)

		return true
	} catch (error) {
		if (
			typeof error === 'object' &&
			error !== null &&
			'name' in error &&
			(error.name === 'NotFound' ||
				error.name === 'NoSuchKey' ||
				error.name === '404')
		) {
			return false
		}

		throw error
	}
}

/**
 * Удаляет файл схемы.
 */
export async function deleteSchematicFile(
	storageKey: string,
): Promise<void> {
	const key = validateKey(storageKey)
	const config = getConfig()

	await getClient().send(
		new DeleteObjectCommand({
			Bucket: config.bucket,
			Key: key,
		}),
	)
}
