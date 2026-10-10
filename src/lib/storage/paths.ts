
/**
 * Вычисляет shard для идентификатора.
 *
 * Используем 100 shard-каталогов:
 * 1842  → 42
 * 73521 → 21
 * 100   → 00
 */
export function getShard(id: bigint | number): string {
	const numericId = typeof id === 'bigint' ? id : BigInt(id)

	return (numericId % BigInt(100)).toString().padStart(2, '0')
}

/**
 * Формирует путь к файлу компонента.
 *
 * Примеры:
 * components/42/1842/images/top.webp
 * components/26/2026/symbols/ne555.svg
 */
export function componentPath(
	componentId: bigint | number,
	folder: string,
	fileName: string,
): string {
	const shard = getShard(componentId)
	const id = componentId.toString()

	return `components / ${shard} /${id}/${folder}/${fileName}`
}

/**
 * Формирует путь к документу компонента.
 *
 * Для даташитов используем отдельную папку datasheets:
 * components/42/1842/datasheets/ne555.pdf
 *
 * Для остальных документов:
 * components/42/1842/documents/manual/manual.pdf
 */
export function componentDocumentPath(
	componentId: bigint | number,
	documentType: string,
	fileName: string,
): string {
	const shard = getShard(componentId)
	const id = componentId.toString()

	if (documentType === 'datasheet' || documentType === 'datasheets') {
		return `components/${shard}/${id}/datasheets/${fileName}`
	}

	return `components/${shard}/${id}/documents/${documentType}/${fileName}`
}

/**
 * Формирует путь к файлу корпуса.
 *
 * Пример:
 * packages/21/73521/images/soic-8.webp
 */
export function packagePath(
	packageId: bigint | number,
	folder: string,
	fileName: string,
): string {
	const shard = getShard(packageId)
	const id = packageId.toString()

	return `packages/${shard}/${id}/${folder}/${fileName}`
}

/**
 * Формирует путь к файлу варианта корпуса.
 *
 * Пример:
 * package-variants/21/73521/images/top.webp
 */
export function packageVariantPath(
	packageVariantId: bigint | number,
	folder: string,
	fileName: string,
): string {
	const shard = getShard(packageVariantId)
	const id = packageVariantId.toString()

	return `package-variants/${shard}/${id}/${folder}/${fileName}`
}

/**
 * Формирует путь к статическому файлу сайта.
 *
 * Пример:
 * site/home/banner.webp
 */
export function sitePath(folder: string, fileName: string): string {
	return `site/${folder}/${fileName}`
}