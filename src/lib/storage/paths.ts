/**
 * Вычисляет shard для идентификатора.
 *
 * Используем 100 shard-каталогов:
 *
 * 1842  → 42
 * 73521 → 21
 */
export function getShard(id: bigint | number): string {
	const numericId = typeof id === 'bigint' ? id : BigInt(id)

	return (numericId % BigInt(100)).toString().padStart(2, '0')
}

/**
 * Формирует путь к файлу компонента.
 *
 * Пример:
 * components/42/1842/images/top.webp
 */
export function componentPath(
	componentId: bigint | number,
	folder: string,
	fileName: string
): string {
	const shard = getShard(componentId)
	const id = componentId.toString()

	return `components/${shard}/${id}/${folder}/${fileName}`
}

/**
 * Формирует путь к документу компонента.
 *
 * Пример:
 * components/42/1842/documents/datasheet/ne555.pdf
 */
export function componentDocumentPath(
	componentId: bigint | number,
	documentType: string,
	fileName: string
): string {
	const shard = getShard(componentId)
	const id = componentId.toString()

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
	fileName: string
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
	fileName: string
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