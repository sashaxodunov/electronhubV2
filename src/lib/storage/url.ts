export function storageUrl(
	storageKey: string
): string {
	return `/api/storage/${storageKey
		.split('/')
		.map(encodeURIComponent)
		.join('/')}`
}