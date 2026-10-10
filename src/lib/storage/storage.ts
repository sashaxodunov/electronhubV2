
import 'server-only'

import {
	deleteStoredObject,
	getStoredObject,
	getStoredObjectInfo,
	storedObjectExists,
	uploadStoredObject,
} from './s3'

function validateStorageKey(storageKey: string): string {
	const key = storageKey.replace(/\\/g, '/').replace(/^\/+/, '')

	if (
		!key ||
		key.split('/').some((part) => !part || part === '.' || part === '..') ||
		key.includes('\0')
	) {
		throw new Error('Недопустимый storage key')
	}

	return key
}

function getContentType(key: string): string {
	const extension = key.split('.').pop()?.toLowerCase()

	switch (extension) {
		case 'png':
			return 'image/png'
		case 'jpg':
		case 'jpeg':
			return 'image/jpeg'
		case 'webp':
			return 'image/webp'
		case 'gif':
			return 'image/gif'
		case 'svg':
			return 'image/svg+xml'
		case 'pdf':
			return 'application/pdf'
		case 'glb':
			return 'model/gltf-binary'
		case 'gltf':
			return 'model/gltf+json'
		case 'obj':
			return 'text/plain'
		case 'stl':
			return 'model/stl'
		case 'json':
			return 'application/json'
		default:
			return 'application/octet-stream'
	}
}

export async function saveFile(
	storageKey: string,
	data: Buffer | Uint8Array,
): Promise<void> {
	const key = validateStorageKey(storageKey)

	await uploadStoredObject(key, data, getContentType(key))
}

export async function getFile(storageKey: string): Promise<Buffer> {
	const key = validateStorageKey(storageKey)
	const result = await getStoredObject(key)

	if (!result.Body) {
		throw new Error('Файл не найден в S3')
	}

	return Buffer.from(await result.Body.transformToByteArray())
}

export async function fileExists(storageKey: string): Promise<boolean> {
	const key = validateStorageKey(storageKey)

	return storedObjectExists(key)
}

export async function getFileInfo(storageKey: string) {
	const key = validateStorageKey(storageKey)

	return getStoredObjectInfo(key)
}

export async function deleteFile(storageKey: string): Promise<void> {
	const key = validateStorageKey(storageKey)

	await deleteStoredObject(key)
}