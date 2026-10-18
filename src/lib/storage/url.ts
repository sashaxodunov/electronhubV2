
function encodeStorageKey(storageKey: string): string {
	const normalized = storageKey
		.replace(/\\/g, '/')
		.replace(/^\/+/, '')

	if (
		!normalized ||
		normalized.includes('\0') ||
		normalized.split('/').some(
			(segment) =>
				!segment ||
				segment === '.' ||
				segment === '..',
		)
	) {
		throw new Error('Некорректный ключ файла.')
	}

	return normalized
		.split('/')
		.map(encodeURIComponent)
		.join('/')
}

export function storageUrl(storageKey: string): string {
	return `/api/storage/${encodeStorageKey(storageKey)}`
}

/**
 * URL файла из DOCUMENTATION_S3_BUCKET.
 * Префикс documentation относится к API-маршруту, а не к S3-ключу.
 */
export function documentationStorageUrl(storageKey: string): string {
	return `/api/storage/documentation/${encodeStorageKey(storageKey)}`
}
