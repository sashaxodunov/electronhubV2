import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const STORAGE_ROOT = path.join(process.cwd(), 'storage')

/**
 * Преобразует storage key в физический путь.
 *
 * Например:
 *
 * components/42/1842/images/lm358.jpg
 *
 * →
 *
 * E:\!WEBSITE\ELECTRONHUB\storage\components\42\1842\images\lm358.jpg
 */
function resolveStoragePath(storageKey: string): string {
	const normalizedKey = storageKey.replace(/\\/g, '/').replace(/^\/+/, '')

	const filePath = path.resolve(STORAGE_ROOT, normalizedKey)
	const rootPath = path.resolve(STORAGE_ROOT)

	if (filePath !== rootPath && !filePath.startsWith(`${rootPath}${path.sep}`)) {
		throw new Error('Недопустимый storage key')
	}

	return filePath
}

/**
 * Сохраняет файл в storage.
 */
export async function saveFile(
	storageKey: string,
	data: Buffer | Uint8Array
): Promise<void> {
	const filePath = resolveStoragePath(storageKey)

	await mkdir(path.dirname(filePath), {
		recursive: true
	})

	await writeFile(filePath, data)
}

/**
 * Читает файл из storage.
 */
export async function getFile(storageKey: string): Promise<Buffer> {
	const filePath = resolveStoragePath(storageKey)

	return readFile(filePath)
}

/**
 * Проверяет существование файла.
 */
export async function fileExists(storageKey: string): Promise<boolean> {
	try {
		const filePath = resolveStoragePath(storageKey)

		await stat(filePath)

		return true
	} catch {
		return false
	}
}

/**
 * Возвращает информацию о файле.
 */
export async function getFileInfo(storageKey: string) {
	const filePath = resolveStoragePath(storageKey)

	const fileStat = await stat(filePath)

	return {
		size: fileStat.size,
		createdAt: fileStat.birthtime,
		modifiedAt: fileStat.mtime
	}
}

/**
 * Удаляет файл из storage.
 */
export async function deleteFile(storageKey: string): Promise<void> {
	const filePath = resolveStoragePath(storageKey)

	await rm(filePath, {
		force: true
	})
}
